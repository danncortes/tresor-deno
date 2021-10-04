import { bcrypt, Bson, config, jwt } from "../deps.ts";
const { CIPHER_PASS, JWT_ALG } = config();

export const createToken = async (
  prop: { email?: string; _id?: Bson.ObjectID },
): Promise<string> => {
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

export const encryptPass = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(password, salt);
};
