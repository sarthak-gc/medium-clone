import { PrismaClient } from "@prisma/client/extension";
import { UserType } from "../generated/prisma";
import { sign } from "hono/jwt";
import { Context } from "hono";

interface UserI {
  username: string;
  email: string;
  userId: string;
  password: string;
  createdAt: Date;
  profile: UserType;
  isDeleted: boolean;
  profilePic: string | null;
}

export const findUser = async (
  prisma: PrismaClient,
  email: string,
  username: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  return user;
};

export const createUser = async (
  prisma: PrismaClient,
  email: string,
  username: string,
  password: string,
  profile: string
) => {
  await prisma.user.create({
    data: {
      username,
      email,
      password,
      profile: profile === "PRIVATE" ? UserType.PRIVATE : UserType.PUBLIC,
    },
  });
};

export const getValidProfileStatus = (profile: string) => {
  if (profile.trim().toLowerCase() === "private") {
    return "PRIVATE";
  } else {
    throw Error("Invalid  type");
  }
};

export const generateRefreshToken = async (c: Context, user: UserI) => {
  return await sign(
    {
      user: { userId: user.userId },
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
    c.env.JWT_SECRET_FOR_REFRESH_TOKEN
  );
};

export const generateAccessToken = async (c: Context, user: UserI) => {
  return await sign(
    {
      user: {
        userId: user.userId,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
    },
    c.env.JWT_SECRET_FOR_ACCESS_TOKEN
  );
};
