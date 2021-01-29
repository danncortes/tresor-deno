import { User } from "./types.ts";
import { db } from "../../database/index.ts";
export default db.collection<User>("users");
