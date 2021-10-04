import config from "../../config/index.ts";
import { Router } from "../../deps.ts";
import { auth } from "./middlewares.ts";

import {
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
} from "./controller.ts";
const router = new Router();

router.post(`${config.baseApi}/user/login`, loginUser);
router.post(`${config.baseApi}/user/logout`, auth, logoutUser);
router.post(`${config.baseApi}/user/logoutAll`, auth, logoutUserAll);
router.get(`${config.baseApi}/user`, auth, findUser);
router.post(`${config.baseApi}/user`, createUser);
router.patch(`${config.baseApi}/user`, auth, updateUser);
router.delete(`${config.baseApi}/user`, auth, deleteUser);

router.post(`${config.baseApi}/user/verify`, verifyAccount);
router.post(
  `${config.baseApi}/user/new-verification-token`,
  auth,
  newVerificationToken,
);

router.post(`${config.baseApi}/user/forgot-password`, forgotPassword);
router.post(
  `${config.baseApi}/user/verify-password-token`,
  verifyPasswordToken,
);
router.post(`${config.baseApi}/user/reset-password`, resetPassword);
router.post(`${config.baseApi}/user/change-password`, auth, changePassword);
router.post(`${config.baseApi}/user/check-password`, auth, checkPassword);

export default router;
