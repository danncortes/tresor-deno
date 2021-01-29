import { Application } from "./deps.ts";
import { routers } from "./routes/index.ts";
import "./database/index.ts";

const app = new Application();

routers.forEach((route) => {
  app.use(route.routes());
});

export default app;
