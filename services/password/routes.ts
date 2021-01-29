import config from "../../config/index.ts";
import { Router } from "../../deps.ts";
import { auth } from "../user/middlewares.ts";

import {
  changePassword,
  checkPassword,
  forgotPassword,
  resetPassword,
  verifyPassword,
} from "./controller.ts";
const router = new Router();

router.post(`${config.baseApi}/password/forgot`, forgotPassword);
router.post(`${config.baseApi}/password/verify`, verifyPassword);
router.post(`${config.baseApi}/password/reset`, resetPassword);
router.post(`${config.baseApi}/password/change`, auth, changePassword);
router.post(`${config.baseApi}/password/check`, auth, checkPassword);

export default router;
