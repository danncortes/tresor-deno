import { bcrypt, Bson, config, jwt, log } from "../../deps.ts";
import { User as UserI, UserCompact } from "./types.ts";
import {
  AlgorithmInput,
  BodyResponseCl,
  BodyResponseEmailCl,
  BodyResponseTokenCl,
  BodyResponseUserCl,
  BodyResponseUserCreatedCl,
} from "../../common/types.ts";
import User from "./model.ts";
import { createToken, encryptPass } from "../../common/helpers.ts";

import { Events } from "../events/types.ts";

const { CIPHER_PASS } = config();
const JWT_ALG = config().JWT_ALG as AlgorithmInput;

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
    const password = await encryptPass(newUser.password);
    const masterp = await encryptPass(newUser.masterp);
    const token = await createToken({ _id });

    newUser = {
      ...newUser,
      _id,
      password,
      masterp,
      tokens: [{ token }],
      verified: false,
      verificationToken: token,
    };

    await User.insertOne(newUser);

    const user = userCompact(newUser);

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
  try {
    const { email, password, masterp }: UserI = await ctx.request.body(
      { type: "json" },
    ).value;
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
  try {
    const user = userCompact(ctx.state.user);
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
  try {
    const { user, token } = await ctx.state;
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
  try {
    const { user } = await ctx.state;
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
  try {
    const { user } = await ctx.state;
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

// deno-lint-ignore no-explicit-any
const verifyAccount = async (ctx: any) => {
  try {
    const { token } = await ctx.request.body({ type: "json" }).value;
    await jwt.verify(token, `${CIPHER_PASS}`, JWT_ALG);
    const user = await User.findOne({ verificationToken: token });
    if (user) {
      await User.updateOne(
        { email: user.email },
        { $set: { verified: true }, $unset: { verificationToken: "" } },
      );
      const body = new BodyResponseCl(200, "Account Verified");
      ctx.response.body = body;
      ctx.response.status = body.status;
    } else {
      throw new Error();
    }
  } catch (e) {
    const body = new BodyResponseCl(400, "Error verifying account");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const newVerificationToken = async (ctx: any) => {
  try {
    const { user, user: { _id } } = await ctx.state;
    const token = await createToken({ _id });
    await User.updateOne(
      { email: user.email },
      { $set: { verificationToken: token } },
    );
    const body = new BodyResponseCl(200, "Verification token created");
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(400, "Error creating verification token");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const forgotPassword = async (ctx: any) => {
  try {
    const { email } = await ctx.request.body({ type: "json" }).value;
    const user = await User.findOne({ email });
    if (user) {
      const token = await createToken({ email });
      await User.updateOne(
        { email: user.email },
        { $set: { forgotPasswordToken: token } },
      );
      // TODO Send Reset password email
      ctx.response.status = 200;
    } else {
      throw new Error();
    }
  } catch (e) {
    ctx.response.status = 403;
  }
};

// deno-lint-ignore no-explicit-any
const verifyPasswordToken = async (ctx: any) => {
  try {
    const { token } = await ctx.request.body({ type: "json" }).value;
    await jwt.verify(token, `${CIPHER_PASS}`, JWT_ALG);
    const user = await User.findOne({ forgotPasswordToken: token });
    if (user) {
      const body = new BodyResponseEmailCl(
        200,
        "Password Verified",
        user.email,
      );
      ctx.response.body = body;
      ctx.response.status = body.status;
    } else {
      throw new Error();
    }
  } catch (e) {
    ctx.response.status = 403;
  }
};

// deno-lint-ignore no-explicit-any
const resetPassword = async (ctx: any) => {
  try {
    const { password, email, token } = await ctx.request.body({ type: "json" })
      .value;
    await jwt.verify(token, `${CIPHER_PASS}`, JWT_ALG);
    const user = await User.findOne({ email });
    const encryptedPass = await encryptPass(password);
    if (user) {
      await User.updateOne(
        { email },
        { $set: { password: encryptedPass, forgotPasswordToken: "" } },
      );
      const body = new BodyResponseCl(200, "Password Reseted");
      ctx.response.body = body;
      ctx.response.status = body.status;
    } else {
      throw new Error();
    }
  } catch (e) {
    ctx.response.status = 403;
  }
};

// deno-lint-ignore no-explicit-any
const changePassword = async (ctx: any) => {
  try {
    const { currentPassword, newPassword } = await ctx.request.body(
      { type: "json" },
    )
      .value;

    const { user } = await ctx.state;
    const match = await bcrypt.compare(currentPassword, user.password);
    if (match) {
      await User.updateOne(
        { email: user.email },
        {
          $set: {
            password: await encryptPass(newPassword),
            tokens: [],
          },
        },
      );

      const body = new BodyResponseCl(200, "Password Updated");
      ctx.response.body = body;
      ctx.response.status = body.status;
    } else {
      throw new Error();
    }
  } catch (e) {
    const body = new BodyResponseCl(403, "Error Updating Password");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const checkPassword = async (ctx: any) => {
  try {
    const { password } = await ctx.request.body(
      { type: "json" },
    )
      .value;
    const { user } = await ctx.state;
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      ctx.response.status = 200;
    } else {
      throw new Error();
    }
  } catch (e) {
    ctx.response.status = 403;
  }
};

// TODO changeMasterKey

export {
  changePassword,
  checkPassword,
  createUser,
  deleteUser,
  findUser,
  forgotPassword,
  loginUser,
  logoutUser,
  logoutUserAll,
  newVerificationToken,
  resetPassword,
  updateUser,
  verifyAccount,
  verifyPasswordToken,
};
