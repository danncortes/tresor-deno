import config from "../../config/index.ts";
import { Router } from "../../deps.ts";
import { auth } from "./middlewares.ts";

import {
  createUser,
  deleteUser,
  findUser,
  loginUser,
  logoutUser,
  logoutUserAll,
  updateUser,
} from "./controller.ts";
const router = new Router();

router.post(`${config.baseApi}/user/login`, loginUser);
router.post(`${config.baseApi}/user/logout`, auth, logoutUser);
router.post(`${config.baseApi}/user/logoutAll`, auth, logoutUserAll);
router.get(`${config.baseApi}/user`, auth, findUser);
router.post(`${config.baseApi}/user`, createUser);
router.patch(`${config.baseApi}/user`, auth, updateUser);
router.delete(`${config.baseApi}/user`, auth, deleteUser);

export default router;
