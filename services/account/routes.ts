import config from "../../config/index.ts";
import { Router } from "../../deps.ts";
import { auth } from "../user/middlewares.ts";

import { newAccountToken, verifyAccount } from "./controller.ts";
const router = new Router();

router.post(`${config.baseApi}/account/verify`, verifyAccount);
router.post(`${config.baseApi}/account/new-token`, auth, newAccountToken);

export default router;
