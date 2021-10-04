import { Credential } from "./types.ts";
import { db } from "../../database/index.ts";
export default db.collection<Credential>("credentials");
