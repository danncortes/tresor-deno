import { bcrypt, Bson, config, jwt, log, encode } from "../../deps.ts";

import { Credential as CredentialI } from "./types.ts";
import {
  BodyResponseCl,
  BodyResponseCredentialCl,
} from "../../common/types.ts";
import Credential from "./model.ts";
// import { cryptData, decryptData } from "../../common/crypt-decrypt.ts";

// deno-lint-ignore no-explicit-any
const createCredential = async (ctx: any) => {
  try {
    const credential = await ctx.request.body({ type: "json" })
      .value;
    const { user } = ctx.state;


    let data: any = credential.data
    // data =  await cryptData('Ejele guonnnnnnnn sadfa sasdfas dfasd fasfasgasfgasf gas as gasg asg asg asfg asf g')
    console.log('crypted data in service', data)

    const newCredential: CredentialI = {
      ...credential,
      _id: new Bson.ObjectID(),
      data,
      userId: user._id,
    };
    await Credential.insertOne(newCredential);

    const body = new BodyResponseCredentialCl(
      203,
      "Credential Created",
      newCredential,
    );
    ctx.response.body = body;
    ctx.response.status = body.status;
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Creating Credential");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

// deno-lint-ignore no-explicit-any
const fetchCredentials = async (ctx: any) => {
  try {
    const { user } = ctx.state;
    const credentials = Credential.find({ userId: { $ne: null } });
    // deno-lint-ignore no-explicit-any
    const data = await credentials.map((cred) => cred);

    let ori = await data[0].data

    // ori = new BinaryReader(ori)

    console.log('getted from server', ori)

    // ori = await decryptData(ori)
    // await console.log('credentials from server', ori)

    // deno-lint-ignore no-explicit-any
    const newData: any = [];

    // deno-lint-ignore no-explicit-any
    // await data.forEach(async (cred: any) => {
    //   console.log(cred.data)
    //   const data = await decryptData(cred.data)
    //   console.log('data!', data)
    // });
    // const data2 = data.map((cred: any) => {
    //   decryptData(cred.data).then(() => {

    //   });
    //   return {
    //     ...cred,
    //     data: decrypted,
    //   };
    // });

    // if (credential) {
    //   credential = {
    //     ...credential,
    //     data: await decryptData(credential.data),
    //   };
    //   const body = new BodyResponseCredentialCl(
    //     203,
    //     "Success",
    //     credential,
    //   );
    //   ctx.response.body = body;
    //   ctx.response.status = body.status;
    // } else {
    //   throw new Error();
    // }
  } catch (e) {
    const body = new BodyResponseCl(400, "Error Getting Credential");
    ctx.response.body = body;
    ctx.response.status = body.status;
  }
};

export { createCredential, fetchCredentials };
