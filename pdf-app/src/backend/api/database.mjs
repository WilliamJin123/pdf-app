import { MongoClient } from "mongodb";
import { configDotenv } from "dotenv";

configDotenv({ path: './config.env' })

export async function connectDb(task) {
    const client = new MongoClient(process.env.ATLAS_URI)

    try {
        await client.connect()
        const result = await task(client)
        if(result){
            return result
        }
    } catch (err) {
        console.log(err)
    } finally {
        await client.close()
    }


}

export async function addFile(client, form, collection) {
    const db = client.db('BookApp')
    const col = db.collection(collection)

    const item = {
        thumbnailId: form.thumbnailId,
        fileId: form.fileId,
        title: form.title,
        author: form.author,
        description: form.description,
        pages: form.pages,
        fileName: form.fileName,
        dateAdded: new Date()
    }

    try {
        const result = await col.insertOne(item)
        console.log(result)
    } catch (err) {
        throw new Error(err)
    }
}


export async function searchFiles(client, title, author, offset = 0, limit = 10, collection, category) {
    const db = client.db('BookApp')
    const col = db.collection(collection)

    const query = {}
    if (title) {
        query.title = new RegExp(title, 'i')
    }
    if (author) {
        query.author = new RegExp(author, 'i')
    }

    const sort = category ? { [category]: 1 } : { dateAdded: -1 }

    try {
        const result = await col.find(query)
            .sort(sort)
            .skip(parseInt(offset, 10))
            .limit(parseInt(limit, 10))
            .toArray()
        
        return result
    } catch (err) {
        throw new Error(err)
    }

}