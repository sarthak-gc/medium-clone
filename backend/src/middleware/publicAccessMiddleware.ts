import { Context, Next } from "hono";

export const publicAccessMiddleware = async (c: Context, next: Next) => {
  await next();
};
