import { DenonConfig } from "https://deno.land/x/denon@2.4.6/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "Deno run --allow-net --allow-read --unstable mod.ts",
      desc: "run my mod.ts file",
    },
  },
};

export default config;
