import { Account } from "./types.ts";
import { db } from "../../database/index.ts";
export default db.collection<Account>("account");
