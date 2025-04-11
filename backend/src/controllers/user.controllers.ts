import { hash } from "../utils/hashPassword";
import { PrismaClient, UserType } from "../generated/prisma/edge";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Context } from "hono";
import { getPrisma } from "../utils/generatePrisma";

export const signUp = async (c: Context) => {
  const body = await c.req.json();
  let profileStatus: string = "PUBLIC";

  try {
    const { username, email, password, profile } = body;
    if (profile) {
      if (typeof profile !== "string") {
        return c.json({ status: "error", message: "Invalid profile type" });
      }

      if (profile.trim().toLowerCase() === "private") {
        profileStatus = "PRIVATE";
      }
    }

    const prisma = getPrisma(c);

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userExists) {
      c.status(400);
      return c.json({
        status: "error",
        message: "User already exists with that email or username",
      });
    }
    const hashedPassword = hash(password, username);
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile:
          profileStatus === "PRIVATE" ? UserType.PRIVATE : UserType.PUBLIC,
      },
    });

    return c.json({ status: "success", message: "user created" });
  } catch (e) {
    console.error(e);
    return c.json({ error: e });
  }
};

export const signIn = async (c: Context) => {
  const body = await c.req.json();
  try {
    const { username, password } = body;

    const prisma = getPrisma(c);

    const hashedPassword = hash(password, username);

    const userExists = await prisma.user.findFirst({
      where: {
        username,
        password: hashedPassword,
      },
    });
    if (!userExists) {
      c.status(404);
      return c.json({
        status: "error",
        message: "User not found",
      });
    }

    const refreshToken = await sign(
      {
        user: { userId: userExists.userId },
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      },
      c.env.JWT_SECRET_FOR_REFRESH_TOKEN
    );

    const accessToken = await sign(
      {
        user: {
          userId: userExists.userId,
          email: userExists.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
      },
      c.env.JWT_SECRET_FOR_ACCESS_TOKEN
    );

    setCookie(c, "token", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
    });
    return c.json({
      message: "Login success",
      data: {
        accessToken,
      },
    });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
};

export const getProfile = async (c: Context) => {
  const { userId } = c.req.param();

  const userDetails = c.get("userDetails"); // to check following list
  console.log(userDetails, " ME");
  if (!userId) {
    c.status(400);
    return c.json({
      status: "error",
      message: "Invalid User Id",
    });
  }
  try {
    const prisma = getPrisma(c);

    const userInfo = await prisma.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        username: true,
        email: true,
        profile: true,
        profilePic: true,
        createdAt: true,
      },
    });

    if (!userInfo) {
      return c.json({ status: "error", message: "User not found" });
    }

    if (userInfo.profile === "PRIVATE") {
      // if(a Follows b) let him see
      return c.json({
        status: "error",
        message: "Follow the person to view their profile",
      });
    }
    const userPosts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
    return c.json({
      status: "success",
      message: "User Info received",
      data: {
        // userInfo,
        // userPosts,

        me: userDetails,
        other: userInfo,
      },
    });
  } catch (e) {
    console.log(e);
    return c.json({
      status: "error",
      message: "Unexpected",
    });
  }
};

export const updatePassword = async (c: Context) => {
  const user = c.get("user");
  const { password } = await c.req.json();

  if (!password.trim()) {
    c.status(400);
    return c.json({
      status: "error",
      message: "Can't update password to empty string",
    });
  }

  try {
    const prisma = getPrisma(c);
    const updatedUser = await prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        password,
      },
    });

    return c.json({ status: "success", message: "Password updated" });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ status: "error", message: "Unexpected error" });
  }
};

export const logout = async (c: Context) => {
  setCookie(c, "token", "");

  return c.json({ status: "success", message: "Logout success" });
};

export const follow = async (c: Context) => {
  const follower = c.get("user");

  const { userId: followingId } = c.req.param();
  console.log(follower.userId, followingId);

  const prisma = getPrisma(c);

  await prisma.follow.create({
    data: {
      followingId: followingId,
      followerId: follower.userId,
    },
  });

  return c.text("here");
};
