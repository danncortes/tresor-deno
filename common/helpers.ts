import { config, jwt } from "../deps.ts";
const { CIPHER_PASS, JWT_ALG } = config();

// deno-lint-ignore no-explicit-any
export const createToken = async (prop: any) => {
  // 15 min
  const min = 900000;
  const expDate = new Date();
  const exp = expDate.valueOf() + min;

  return await jwt.create(
    { alg: JWT_ALG, typ: "JWT" } as jwt.Header,
    { ...prop, exp },
    CIPHER_PASS,
  );
};
