import {MongoClient, Db} from "mongodb";

const uri = process.env.MONGODB_URI as string;

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
    if (db) return db;
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("airline");
    return db;
}
