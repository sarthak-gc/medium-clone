import { Context } from "hono";
import { PrismaClient } from "../generated/prisma/edge";

export const getPrisma = (c: Context) => {
  return new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  });
};
