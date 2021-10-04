import { Bson } from "../../deps.ts";

export interface Credential {
  _id: Bson.ObjectID;
  userId: Bson.ObjectID;
  name: string;
  // deno-lint-ignore no-explicit-any
  data: any;
}
