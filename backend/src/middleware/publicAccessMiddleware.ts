import { Context, Next } from "hono";

export const publicAccessMiddleware = async (c: Context, next: Next) => {
  console.log(c.get("userDetails"));
  console.log("INside middleware");
  await next();
};
