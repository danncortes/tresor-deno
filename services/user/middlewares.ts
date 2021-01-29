import { Bson, config, jwt } from "../../deps.ts";
import User from "./model.ts";
import { AlgorithmInput, BodyResponseCl } from "../../common/types.ts";

const { CIPHER_PASS } = config();
const JWT_ALG = config().JWT_ALG as AlgorithmInput;

// deno-lint-ignore no-explicit-any
export const auth = async (ctx: any, next: () => any) => {
  try {
    let token = await ctx.request.headers.get("authorization");
    token = token.replace("Bearer ", "");
    const decoded = await jwt.verify(token, `${CIPHER_PASS}`, JWT_ALG);
    const user = await User.findOne(
      { _id: new Bson.ObjectId(decoded._id), "tokens.token": token },
    );
    if (!user) {
      throw new Error("Session Error");
    }
    ctx.state = { user, token };
    await next();
  } catch (e) {
    const body = new BodyResponseCl(400, e.message);
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};
