import EventEmitter, { config, jwt } from "../../deps.ts";
import { Event, Events } from "./types.ts";

import { AlgorithmInput } from "../../common/types.ts";

const { CIPHER_PASS } = config();
const JWT_ALG = config().JWT_ALG as AlgorithmInput;

const ee = new EventEmitter();

ee.on("user", async (msg: Event) => {
  const { data: { _id }, action } = msg;

  if (action === Events.UserDeleted) {
    await console.log("");
  }
});

export default ee;
