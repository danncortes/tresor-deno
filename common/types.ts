import { UserCompact } from "../services/user/types.ts";
import { Credential } from "../services/credential/types.ts";
export type { AlgorithmInput } from "https://deno.land/x/djwt@v2.0/algorithm.ts";

export interface BodyResponseBase {
  message: string;
  status: number;
}

export interface BodyResponseToken extends BodyResponseBase {
  token: string;
}

export interface BodyResponseUser extends BodyResponseBase {
  user: UserCompact;
}

export interface BodyResponseCredential extends BodyResponseBase {
  credential: Credential;
}

export interface BodyResponseEmail extends BodyResponseBase {
  email: string;
}

export class BodyResponseCl implements BodyResponseBase {
  message;
  status;
  constructor(code: number, message: string) {
    this.message = message;
    this.status = code;
  }
}

export class BodyResponseEmailCl implements BodyResponseEmail {
  message;
  status;
  email;
  constructor(code: number, message: string, email: string) {
    this.message = message;
    this.status = code;
    this.email = email;
  }
}

export class BodyResponseUserCl implements BodyResponseUser {
  message;
  status;
  user;
  constructor(code: number, message: string, user: UserCompact) {
    this.message = message;
    this.status = code;
    this.user = user;
  }
}

export class BodyResponseTokenCl implements BodyResponseToken {
  message;
  status;
  token;
  constructor(code: number, message: string, token: string) {
    this.message = message;
    this.status = code;
    this.token = token;
  }
}

export class BodyResponseUserCreatedCl
  implements BodyResponseUser, BodyResponseToken {
  message;
  status;
  token;
  user;
  constructor(code: number, message: string, user: UserCompact, token: string) {
    this.message = message;
    this.status = code;
    this.user = user;
    this.token = token;
  }
}

export class BodyResponseCredentialCl implements BodyResponseCredential {
  message;
  status;
  credential;
  constructor(code: number, message: string, credential: Credential) {
    this.message = message;
    this.status = code;
    this.credential = credential;
  }
}
