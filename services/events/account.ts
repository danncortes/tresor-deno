import EventEmitter from "../../deps.ts";
import { Event, Events } from "./types.ts";
import User from "../user/model.ts";

const ee = new EventEmitter();

ee.on("account", async (msg: Event) => {
  const { data: { userId }, action } = msg;
  if (action === Events.AccountVerified) {
    await User.updateOne(
      { _id: userId },
      { $set: { verified: true } },
    );
  }
});

export default ee;
