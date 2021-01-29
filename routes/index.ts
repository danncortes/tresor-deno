import userRouter from "../services/user/routes.ts";
import accountRouter from "../services/account/routes.ts";
import passwordRouter from "../services/password/routes.ts";

export const routers = [userRouter, accountRouter, passwordRouter];
