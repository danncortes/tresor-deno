import { bcrypt, Bson, log } from "../../deps.ts";
import { User as UserI, UserCompact } from "./types.ts";
import {
  BodyResponseCl,
  BodyResponseTokenCl,
  BodyResponseUserCl,
  BodyResponseUserCreatedCl,
} from "../../common/types.ts";
import User from "./model.ts";
import ee from "../events/user.ts";
import { createToken } from "../../common/helpers.ts";

import { Events } from "../events/types.ts";

const userCompact = (user: UserI): UserCompact => {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    verified: user.verified,
  };
};

// deno-lint-ignore no-explicit-any
const createUser = async (ctx: any) => {
  try {
    let newUser: UserI = await ctx.request.body({ type: "json" }).value;
    const _id = new Bson.ObjectID();
    const salt = await bcrypt.genSalt(8);
    const password = await bcrypt.hash(newUser.password, salt);
    const masterp = await bcrypt.hash(newUser.masterp, salt);
    const token = await createToken({ _id });

    newUser = {
      ...newUser,
      _id,
      password,
      masterp,
      tokens: [{ token }],
      verified: false,
    };

    await User.insertOne(newUser);

    const user = userCompact(newUser);

    await ee.emit("user", { action: Events.UserCreated, data: user });

    //TODO send email
    const body = new BodyResponseUserCreatedCl(
      203,
      "User Created",
      user,
      token,
    );
    ctx.response.body = body;
    ctx.response.status = body.status;
    log.info(body);
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Creating User");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const updateUser = async (ctx: any) => {
  const body = await ctx.request.body(
    { type: "json" },
  ).value;

  const { user } = ctx.state;

  const fieldsToUpdate = Object.keys(body);
  const allowedUpdates = ["name", "password"];
  const isValidUpdate = fieldsToUpdate.every((field) => {
    return allowedUpdates.includes(field);
  });

  if (isValidUpdate) {
    fieldsToUpdate.forEach((field) => {
      user[field] = body[field];
    });
    try {
      await User.updateOne(
        { email: user.email },
        { $set: user },
      );

      const body = new BodyResponseUserCl(
        202,
        "User Updated",
        userCompact(user),
      );

      ctx.response.body = body;
      ctx.response.status = body.status;
    } catch (e) {
      const body = new BodyResponseCl(400, "Error Updating User");
      ctx.response.body = body;
      ctx.response.status = body.status;
    }
  } else {
    const body = new BodyResponseCl(400, "Update not allowed");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const loginUser = async (ctx: any) => {
  const { email, password, masterp }: UserI = await ctx.request.body(
    { type: "json" },
  ).value;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Login Error");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    const masterPassMatch = await bcrypt.compare(masterp, user.masterp);

    if (!passwordMatch || !masterPassMatch) {
      throw new Error("Login Error");
    }

    const token = await createToken({ _id: user._id });
    user.tokens.push({ token });

    await User.updateOne(
      { email: user.email },
      { $set: user },
    );
    const body = new BodyResponseTokenCl(200, "User Logged", token);
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Login User");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const findUser = (ctx: any) => {
  const user = userCompact(ctx.state.user);
  try {
    const body = new BodyResponseUserCl(200, "User Found", user);
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(401, "Error Finding User");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const logoutUser = async (ctx: any) => {
  const { user, token } = await ctx.state;

  try {
    // deno-lint-ignore no-explicit-any
    user.tokens = user.tokens.filter((tokn: any) => tokn.token !== token);
    await User.updateOne(
      { email: user.email },
      { $set: user },
    );
    const body = new BodyResponseCl(200, "User Logged Out");
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(500, "Error Loggin Out User");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const logoutUserAll = async (ctx: any) => {
  const { user } = await ctx.state;

  try {
    user.tokens = [];
    await User.updateOne(
      { email: user.email },
      { $set: user },
    );

    const body = new BodyResponseCl(200, "User Logged Out");
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(500, "Error Loggin Out User");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const deleteUser = async (ctx: any) => {
  const { user } = await ctx.state;
  try {
    await User.deleteOne({ _id: user._id });

    //TODO delete credentials using an event
    const body = new BodyResponseUserCl(200, "User Deleted", userCompact(user));
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(500, "Error Deleting User");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// TODO changeMasterKey

export {
  createUser,
  deleteUser,
  findUser,
  loginUser,
  logoutUser,
  logoutUserAll,
  updateUser,
};
