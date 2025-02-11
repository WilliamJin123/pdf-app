import http from "http";
import { connectDb, addFile } from "./database.mjs";
import { parse } from "querystring";
import { title } from "process";
import cors from "cors";
import multer from "multer";
import { configDotenv} from "dotenv";

configDotenv({path: './config.env'})


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
                file:{
                    buffer: req.file.buffer,
                    name: req.file.originalname,  
                    mimetype: req.file.mimetype,         
                    size: req.file.size
                }
            });
        });
    })
}


const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'POST' && req.url === '/upload') {

        try {
            const form = await parseForm(req)
            const {fields, file} = form
            if (!fields.title || !fields.author || !fields.description || !fields.pages) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Missing required fields' }))
                return
            }

            //add file to bucket
            // console.log('name', file.name)

            // await fetch('http://localhost:8787/'+file.name, {
            //     method:'PUT',
            //     body: file.buffer,
            //     headers: {
            //         'X-Custom-Auth-Key': process.env.AUTH_KEY_SECRET
            //     }
            // })

            const writeData = {
                title: fields.title,
                author: fields.author,
                description: fields.description,
                pages: parseInt(fields.pages, 10),
                key: file.name
            }

            console.log(writeData)

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
})

server.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`)
})