import http from "http";
import { connectDb, addFile, searchFiles } from "./database.mjs";
import { parse } from "querystring";
import { title } from "process";
import cors from "cors";
import multer from "multer";
import { configDotenv } from "dotenv";
import { v4 as uuidv4 } from 'uuid'
import { TaskQueuePC } from "./taskqueue-consumer-producer.mjs";
import bucket from "../pdf-worker/src/bucket.mjs";
import { generateThumbnail } from "./thumbnail.mjs";


configDotenv({ path: './config.env' })


const PORT = 5000

const upload = multer()

function parseForm(req) {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, {}, (err) => {
            if (err) {
                reject(err);
                return;
            }
            // console.log(req)
            resolve({
                fields: req.body,
                file: {
                    buffer: req.file.buffer,
                    name: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                }
            });
        });
    })
}

const bucketServer = 'https://pdf-worker.jinwilliam-jin.workers.dev'

const localBucketServer = 'http://127.0.0.1:8787'

const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'POST' && req.url === '/upload') {
        const putFilesInBucket = async () => {
            try {
                const form = await parseForm(req)
                const { fields, file } = form
                if (!fields.title || !fields.author || !fields.description || !fields.pages) {
                    res.writeHead(400, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: 'Missing required fields' }))
                    return
                }
                const fileId = uuidv4()
                const thumbnailId = uuidv4()
                //add file to bucket
                // console.log('name', file.name)
                const thumbnailBuffer = await generateThumbnail(file.buffer)

                const thumbnailResponse = await fetch(`${bucketServer}/${thumbnailId}`, {
                    method: 'PUT',
                    body: thumbnailBuffer,
                    headers: {
                        'X-Custom-Auth-Key': process.env.AUTH_KEY_SECRET,
                        'fileName': file.name,
                        'contentType': "image/png"
                    }
                })
                if (!thumbnailResponse.ok) {
                    throw new Error(`Failed to upload thumbnail, status: ${thumbnailResponse.status}`);
                }

                const fileResponse = await fetch(`${bucketServer}/${fileId}`, {
                    method: 'PUT',
                    body: file.buffer,
                    headers: {
                        'X-Custom-Auth-Key': process.env.AUTH_KEY_SECRET,
                        'fileName': file.name,
                        'contentType': "application/pdf"
                    }
                }) //note that this response doesnt throw errors, only sends responses with status codes, so the next if loop is crucial
                if (!fileResponse.ok) {
                    throw new Error(`Failed to upload file, status: ${fileResponse.status}`);
                }


                const writeData = {
                    fileId: fileId,
                    thumbnailId: thumbnailId,
                    title: fields.title,
                    author: fields.author,
                    description: fields.description,
                    pages: parseInt(fields.pages, 10),
                    fileName: file.name
                }



                await connectDb(async (client) => {
                    await addFile(client, writeData, 'Files')
                })
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Metadata stored successfully" }));

            } catch (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Error saving metadata", error: error.message }));
            }
        }
        putFilesInBucket()

    } else if (req.method === 'GET' && req.url.includes('/search')) {
        const queryString = req.url.split('?')[1]
        const params = new URLSearchParams(queryString)
        const title = params.get('title')
        const author = params.get('author')
        const offset = params.get('offset')
        const limit = params.get('limit')
        console.log(title, author, offset, limit)
        try {
            const result = await connectDb(async (client) => {
                const result = await searchFiles(client, title, author, offset, limit, 'Files')
                return result
            })
            console.log('data entries to be fetched', result)
            if (!result.length) {

                res.end(JSON.stringify([]))
                return
            }
            //implement a task queue to fetch files from bucket for each item in result
            let completedFetches = 0
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write('[');
            const getFilesFromBucket = async () => {
                const taskQ = new TaskQueuePC(3)
                for (let i = 0; i < result.length; i++) {
                    taskQ.runTask(async () => {
                        const index = i
                        try {

                            console.log('fetching file', result[index].thumbnailId)
                            const bucketFile = await fetch(`${bucketServer}/${result[index].thumbnailId}`, {
                                method: 'GET',
                                headers: {
                                    'X-Custom-Auth-Key': process.env.AUTH_KEY_SECRET,

                                }
                            })
                            console.log(bucketFile)
                            const fileArrayBuffer = await bucketFile.arrayBuffer()
                            const buffer = Buffer.from(fileArrayBuffer)
                            result[index].thumbnail = buffer

                        } catch (err) {
                            console.log(err) //no throw because want succesful searches to go through regardless of failed fetches
                        } finally {
                            return index
                        }

                    }).then((index) => {
                        console.log('file fetched', result[index].id, result[index].file)
                        completedFetches++
                        const bookData = JSON.stringify(result[index]); //to change
                        res.write((completedFetches > 1 ? ',' : '') + bookData + '\n');
                        if (completedFetches === result.length) {
                            res.write(']');
                            res.end()
                            console.log('Finished streaming all fetches!');
                        }
                    })
                }
            }
            await getFilesFromBucket()



        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error searching", error: err.message }));
        }
    } else if (req.method === 'GET' && req.url.includes('/read')) {
        try {
            const bookFile = await fetch(`${bucketServer}/${req.url.split('/')[2]}`, {
                method: 'GET',
                headers: {
                    'X-Custom-Auth-Key': process.env.AUTH_KEY_SECRET
                }
            })
            console.log('bookfile', bookFile)
            const bookArrayBuffer = await bookFile.arrayBuffer()
            const buffer = Buffer.from(bookArrayBuffer)
            const bookData = JSON.stringify(buffer)
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(bookData)
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error searching", error: err.message }));
        }
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}).on('error', (error) => {
    console.log("Server start error", error.message)
})