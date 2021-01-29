import EventEmitter, { config, jwt } from "../../deps.ts";
import { Event, Events } from "./types.ts";
import Account from "../account/model.ts";
import { AlgorithmInput } from "../../common/types.ts";

const { CIPHER_PASS } = config();
const JWT_ALG = config().JWT_ALG as AlgorithmInput;

const ee = new EventEmitter();

ee.on("user", async (msg: Event) => {
  const { data: { _id }, action } = msg;

  if (action === Events.UserCreated) {
    const token = await jwt.create(
      { alg: JWT_ALG, typ: "JWT" } as jwt.Header,
      { _id },
      CIPHER_PASS,
    );

    await Account.insertOne({ token, userId: _id });
  }
});

export default ee;
