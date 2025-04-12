import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { decode } from "hono/jwt";
import { getPrisma } from "../utils/generatePrisma";

interface decodedUserI {
  userId: string;
  email: string;
}
export const authenticationMiddleware = async (c: Context, next: Next) => {
  const cookieToken = getCookie(c, "token");
  if (!cookieToken) {
    return c.json({ status: "error", message: "No token found" });
  }

  try {
    const decoded = decode(cookieToken);

    const user = decoded.payload.user as decodedUserI;
    c.set("user", user);
    const prisma = getPrisma(c);

    const validUser = await prisma.user.findFirst({
      where: {
        userId: user.userId,
        email: user.email,
        isDeleted: false,
      },
    });
    if (!validUser) {
      c.status(403);
      return c.json({ message: "User doesn't exist" });
    }

    c.set("userDetails", validUser);

    return await next();
  } catch (e) {
    console.log(e);
    c.status(403);
    return c.text("User doesn't exist");
  }
};
