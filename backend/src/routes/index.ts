import { Hono } from "hono";
import userRoutes from "./userRoutes";
import blogRouter from "./blogRoutes";

const router = new Hono();

router.route("/user", userRoutes);
router.route("/blog", blogRouter);

export default router;
