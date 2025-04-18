import { Hono } from "hono";
import router from "./routes";
import { cors } from "hono/cors";

const app = new Hono();
const frontendUrl = "https://medium-rare-three.vercel.app";
app.use(
  cors({
    origin: frontendUrl || "http://localhost:5173",
    credentials: true,
  })
);

app.route("/api/v1", router);

export default app;
