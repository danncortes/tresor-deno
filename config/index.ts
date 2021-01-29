import { config } from "../deps.ts";
import development from "./development.ts";
const { ENV_MODE } = config();

export default (() => {
  if (ENV_MODE === "development") {
    return development;
  }
  return development;
})();
