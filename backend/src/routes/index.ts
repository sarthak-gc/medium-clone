import { Hono } from "hono";
import userRoutes from "./userRoutes";
import blogRouter from "./blogRoutes";

const router = new Hono<{
  Bindings: {
    FRONTEND_URL: string;
  };
}>();

router.use(async (c, next) => {
  if (
    c.req
      .header("referer")
      ?.startsWith(c.env.FRONTEND_URL || "http://localhost:5173")
  ) {
    c.res.headers.set(
      "Access-Control-Allow-Origin",
      "https://medium-rare.sarthakgc.com.np"
    );
    c.res.headers.set(
      "Access-Control-Allow-Origin",
      "https://medium-rare.sarthakgc.com.np"
    );
    c.res.headers.set(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT"
    );
    c.res.headers.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    await next();
  }

  return c.json({
    error: "URL UNAVAILABLE",
  });
});
router.route("/user", userRoutes);
router.route("/blog", blogRouter);

export default router;
