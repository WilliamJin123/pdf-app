import { MongoClient } from "mongodb";
import { configDotenv} from "dotenv";

configDotenv({path: './config.env'})

export async function connectDb(task) {
    const client = new MongoClient(process.env.ATLAS_URI)

    try{
        await client.connect()
        await task(client)
    }catch(err){
        console.log(err)
    }finally{
        await client.close()
    }


}

export async function addFile(client, form, collection) {
    const db = client.db('BookApp')
    const col = db.collection(collection)

    const item = {
        title: form.title,
        author: form.author,
        description: form.description,
        pages: form.pages,
        dateAdded: new Date()
    }

    try{
        const result = await col.insertOne(item)
        console.log(result)
    }catch(err){
        throw new Error(err)
    }
}


