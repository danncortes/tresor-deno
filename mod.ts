import app from "./app.ts";
import config from "./config/index.ts";

app.listen({ port: config.port });

console.log(`listening to ${config.port}`)
