import { config, jwt } from "../../deps.ts";
import Account from "./model.ts";
import ee from "../events/account.ts";
import { AlgorithmInput, BodyResponseCl } from "../../common/types.ts";

import { Events } from "../events/types.ts";

const { CIPHER_PASS } = config();
const JWT_ALG = config().JWT_ALG as AlgorithmInput;

// deno-lint-ignore no-explicit-any
const verifyAccount = async (ctx: any) => {
  try {
    const { token } = await ctx.request.body({ type: "json" }).value;
    await jwt.verify(token, `${CIPHER_PASS}`, JWT_ALG);
    const account = await Account.findOne({ token });
    await Account.deleteOne({ token });
    await ee.emit(
      "account",
      { action: Events.AccountVerified, data: account },
    );

    const body = new BodyResponseCl(200, "Account Verified");
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(400, "Error verifying account");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const newAccountToken = async (ctx: any) => {
  const { user: { _id } } = await ctx.state;
  try {
    await Account.deleteMany({ userId: _id });
    const token = await jwt.create(
      { alg: JWT_ALG, typ: "JWT" } as jwt.Header,
      { _id },
      CIPHER_PASS,
    );

    await Account.insertOne({ token, userId: _id });
    const body = new BodyResponseCl(200, "Verification token created");
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(400, "Error creating verification token");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

export { newAccountToken, verifyAccount };
