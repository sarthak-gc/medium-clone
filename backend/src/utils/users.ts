import { PrismaClient, UserType } from "../generated/prisma";
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

export const passUpdate = async (
  prisma: PrismaClient,
  userId: string,
  hashedPassword: string
) => {
  console.log(userId);

  await prisma.user.update({
    where: {
      userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const getDetail = async (prisma: PrismaClient, userId: string) => {
  const details = await prisma.user.findUnique({
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
  return details;
};

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
  if (!profile) {
    return "PUBLIC";
  } else if (profile.trim().toLowerCase() === "private") {
    return "PRIVATE";
  } else if (profile.trim().toLowerCase() === "public") {
    return "PUBLIC";
  } else {
    throw Error("Invalid Profile type");
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
export const followAgain = async (prisma: PrismaClient, followId: string) => {
  const followedAt = new Date(Date.now());
  await prisma.follow.update({
    where: {
      followId,
    },
    data: {
      isFollowing: true,
      unfollowedAt: null,
      followedAt,
    },
  });
};

export const newFollow = async (
  prisma: PrismaClient,
  followerId: string,
  followingId: string
) => {
  await prisma.follow.create({
    data: {
      followingId,
      followerId,
    },
  });
};

export const removeFollow = async (
  prisma: PrismaClient,

  followId: string
) => {
  const unfollowedAt = new Date(Date.now());
  await prisma.follow.update({
    where: {
      followId,
    },
    data: {
      isFollowing: false,
      unfollowedAt,
    },
  });
};

export const findProfile = async (prisma: PrismaClient, userId: string) => {
  const profile = await prisma.user.findFirst({
    where: {
      userId,
    },
  });
  return profile;
};

// while getting the following and follower list, the condition might seem a bit confusing as it might seem like i am fetching follower while trying to fetch the following and vice versa, but this makes sense as if a follows  1 2 3, then to the data is stored as following in the table

//  followerId | followingId
//      a             1
//      a             2
//      a             3
//      a             4

// so to fetch the following list of a here, we need to fetch the data from by taking the followerId

// in short,
// to get following list of a user → filter by followerId
// to get followers of a user → filter by followingId

export const getFollowers = async (prisma: PrismaClient, userId: string) => {
  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
  });
  return followers;
};

export const getFollowing = async (prisma: PrismaClient, userId: string) => {
  const followings = await prisma.follow.findMany({
    where: {
      followerId: userId,
      isBlocked: false,
      isFollowing: true,
    },
  });
  return followings;
};

export const getPostsForFollower = async (
  prisma: PrismaClient,
  authorId: string
) => {
  const userBlogs = await prisma.blog.findMany({
    where: {
      authorId,
      OR: [{ visibility: "PRIVATE" }, { visibility: "PUBLIC" }],
    },
  });
  return userBlogs;
};
export const getPostsForPublic = async (
  prisma: PrismaClient,
  authorId: string
) => {
  const userBlogs = await prisma.blog.findMany({
    where: {
      authorId,
      visibility: "PUBLIC",
    },
  });
  return userBlogs;
};
