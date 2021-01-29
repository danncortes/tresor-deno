import { Bson } from "../../deps.ts";

export interface Account {
  userId: Bson.ObjectID;
  token: string;
}
