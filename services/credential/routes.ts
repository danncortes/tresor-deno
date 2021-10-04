import config from "../../config/index.ts";
import { Router } from "../../deps.ts";
import { auth } from "../user/middlewares.ts";

import { createCredential, fetchCredentials } from "./controller.ts";
const router = new Router();

router.post(`${config.baseApi}/credential/create`, auth, createCredential);
router.get(`${config.baseApi}/credential/fetch`, auth, fetchCredentials);

export default router;
