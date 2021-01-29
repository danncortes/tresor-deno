import { MongoClient } from "../deps.ts";

const client = new MongoClient();
await client.connect("mongodb://localhost:27017");
const db = await client.database("tresor");

export { db };
export default client;
