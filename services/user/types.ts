import { Bson } from "../../deps.ts";

type Token = {
  token: string;
};

export interface User {
  _id: Bson.ObjectID;
  name: string;
  email: string;
  password: string;
  masterp: string;
  tokens: Token[];
  verified: boolean;
}

export interface UserCompact {
  _id: Bson.ObjectID;
  email: string;
  name: string;
  verified: boolean;
}
