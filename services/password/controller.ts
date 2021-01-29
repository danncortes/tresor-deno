import { bcrypt, Bson, config, jwt, log } from "../../deps.ts";
import { Password as PasswordI } from "./types.ts";
import { BodyResponseCl, BodyResponseEmailCl } from "../../common/types.ts";
import Password from "./model.ts";
import User from "../user/model.ts";
import ee from "../events/user.ts";
import { createToken } from "../../common/helpers.ts";

import { Events } from "../events/types.ts";

const { CIPHER_PASS } = config();

// deno-lint-ignore no-explicit-any
const forgotPassword = async (ctx: any) => {
  try {
    const { email } = await ctx.request.body({ type: "json" }).value;
    await Password.deleteMany({ email });
    const user = await User.findOne({ email });
    if (user) {
      const token = await createToken({ email });
      await Password.insertOne({ email, token });
      // TODO Send Reset password email

      ctx.response.status = 200;
    } else {
      ctx.response.status = 400;
    }
  } catch (e) {
    ctx.response.status = 400;
  }
};

// deno-lint-ignore no-explicit-any
const verifyPassword = async (ctx: any) => {
  const { token } = await ctx.request.body({ type: "json" }).value;
  try {
    await jwt.verify(token, `${CIPHER_PASS}`, "HS512");
    const password = await Password.findOne({ token });
    if (password) {
      const body = new BodyResponseEmailCl(
        200,
        "Password Verified",
        password.email,
      );
      ctx.response.body = body;
      ctx.response.status = body.status;
    } else {
      ctx.response.status = 400;
    }
  } catch (e) {
    ctx.response.status = 400;
  }
};

// deno-lint-ignore no-explicit-any
const resetPassword = async (ctx: any) => {
  try {
    await console.log();
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Creating Token");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const changePassword = async (ctx: any) => {
  try {
    await console.log();
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Creating Token");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const checkPassword = async (ctx: any) => {
  try {
    await console.log();
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Creating Token");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

export {
  changePassword,
  checkPassword,
  forgotPassword,
  resetPassword,
  verifyPassword,
};
