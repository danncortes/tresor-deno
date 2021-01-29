import app from "./app.ts";
import config from "./config/index.ts";

await app.listen({ port: config.port });
