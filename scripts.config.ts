import { DenonConfig } from "https://deno.land/x/denon@2.4.7/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "Deno run --allow-net --allow-read --unstable mod.ts",
      desc: "run my mod.ts file",
    },
    docker: {
      cmd: "docker run --name mongo -p 27017:27017 -d mongo",
    },
  },
};

export default config;
