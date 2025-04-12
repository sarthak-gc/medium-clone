import { Context } from "hono";

export const handleError = (e: unknown, c: Context) => {
  console.error(e);
  if (e instanceof Error)
    return c.json({
      status: "error",
      message: e.message,
    });
};
