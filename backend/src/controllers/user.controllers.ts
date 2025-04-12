import { hash } from "../utils/hashPassword";
import { setCookie } from "hono/cookie";
import { Context } from "hono";
import { getPrisma } from "../utils/generatePrisma";
import {
  createUser,
  findProfile,
  findUser,
  followAgain,
  generateAccessToken,
  generateRefreshToken,
  getDetail,
  getFollowers,
  getFollowing,
  getPostsForFollower,
  getPostsForPublic,
  getValidProfileStatus,
  newFollow,
  passUpdate,
  removeFollow,
} from "../utils/users";
import { handleError } from "../utils/handleError";
import { UserType } from "../generated/prisma";

export const signUp = async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log(body, "OUTSIDE TRY");
    let profileStatus: string = "PUBLIC";
    console.log(body, "INSIDE TRY");
    const { username, email, password, profile } = body;

    if (!username || !email || !password) {
      return c.json({
        status: "error",
        message: "username, email, password required",
      });
    }

    profileStatus = getValidProfileStatus(profile);

    const prisma = getPrisma(c);

    const user = await findUser(prisma, email, username);

    if (user) {
      c.status(400);
      return c.json({
        status: "error",
        message: "User already exists with that email or username",
      });
    }

    const hashedPassword = hash(password, username);
    await createUser(prisma, email, username, hashedPassword, profileStatus);

    return c.json({ status: "success", message: "user created" });
  } catch (e) {
    console.error(e);
    return handleError(e, c);
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
        isDeleted: false,
      },
    });
    if (!userExists) {
      c.status(404);
      return c.json({
        status: "error",
        message: "User not found",
      });
    }

    const refreshToken = await generateRefreshToken(c, userExists);

    const accessToken = await generateAccessToken(c, userExists);

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
    c.status(500);
    return handleError(e, c);
  }
};

export const getProfile = async (c: Context) => {
  const { profileId } = c.req.param();

  const userDetails = c.get("userDetails");

  if (!profileId) {
    c.status(400);
    return c.json({
      status: "error",
      message: "Invalid User Id",
    });
  }

  try {
    const prisma = getPrisma(c);

    const userInfo = await getDetail(prisma, profileId);

    if (!userInfo) {
      return c.json({ status: "error", message: "User not found" });
    }

    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: userDetails.userId,
        followingId: profileId,
        isFollowing: true,
      },
    });

    let userBlogs;

    if (userInfo.profile === "PRIVATE") {
      const isAuthor = userDetails.userId === profileId;

      if (!isFollowing && !isAuthor)
        return c.json({
          status: "error",
          message: "Follow the person to view their profile",
        });
      userBlogs = await getPostsForFollower(prisma, profileId);
    }

    if (userInfo.profile === "PUBLIC") {
      // if follows let them see all, if doesn't follow then just public posts
      if (isFollowing) {
        userBlogs = await getPostsForFollower(prisma, profileId);
      } else {
        userBlogs = await getPostsForPublic(prisma, profileId);
      }
    }

    return c.json({
      status: "success",
      message: "User Info received",
      data: {
        blogs: userBlogs,
      },
    });
  } catch (e) {
    return handleError(e, c);
  }
};

export const updatePassword = async (c: Context) => {
  const user = c.get("user");
  const userDetails = c.get("userDetails");
  const { password } = await c.req.json();

  if (!password.trim()) {
    c.status(400);
    return c.json({
      status: "error",
      message: "Can't update password to empty string",
    });
  }

  try {
    const { username } = userDetails;
    const hashedPassword = hash(password, username);
    const prisma = getPrisma(c);
    await passUpdate(prisma, user.userId, hashedPassword);

    return c.json({
      status: "success",
      message: "Password updated",
    });
  } catch (e) {
    handleError(e, c);
  }
};

export const logout = async (c: Context) => {
  setCookie(c, "token", "");

  return c.json({ status: "success", message: "Logout success" });
};

export const follow = async (c: Context) => {
  const follower = c.get("user");

  const { profileId: followingId } = c.req.param();
  const prisma = getPrisma(c);

  const followingPreviouslyUnfollowed = await prisma.follow.findFirst({
    where: {
      followingId,
      followerId: follower.userId,
      isFollowing: true,
    },
  });
  if (followingPreviouslyUnfollowed) {
    followAgain(prisma, followingPreviouslyUnfollowed.followId);
  } else {
    newFollow(prisma, follower.userId, followingId);
  }

  return c.json({
    status: "success",
    message: "followed successfully",
  });
};

export const unfollow = async (c: Context) => {
  const follower = c.get("user");

  const { profileId: followingId } = c.req.param();
  console.log(follower.userId, followingId);

  const prisma = getPrisma(c);

  const follows = await prisma.follow.findFirst({
    where: {
      followerId: follower.userId,
      followingId,
    },
  });

  if (!follows) {
    c.status(404);
    return c.json({
      status: "error",
      message: "Cannot unfollow the person who you haven't followed",
    });
  }
  if (!follows.isFollowing) {
    c.status(404);
    return c.json({
      status: "error",
      message: "Cannot unfollow the person who you haven't followed",
    });
  }

  removeFollow(prisma, follows.followId);

  return c.text("here");
};

export const getSelfFollowers = async (c: Context) => {
  const { userId } = c.get("userId");
  const prisma = getPrisma(c);
  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
  });

  return c.json({
    status: "success",
    message: "Follower Retrieved",
    data: {
      followers: followers.length === 0 ? [] : followers,
    },
  });
};

export const getSelfFollowing = async (c: Context) => {
  const { userId } = c.get("userId");

  const prisma = getPrisma(c);

  const followings = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
  });

  return c.json({
    status: "success",
    message: "Following Retrieved",
    data: {
      followers: followings.length === 0 ? [] : followings,
    },
  });
};

export const otherFollowers = async (c: Context) => {
  const { userId } = c.get("userId");
  const { profileId } = c.req.param();

  const prisma = getPrisma(c);
  const profile = await findProfile(prisma, profileId);

  if (!profile) {
    return c.json({
      status: "error",
      message: "Profile not found",
    });
  }

  const followers = await getFollowers(prisma, userId);

  if (profile.profile == UserType.PUBLIC) {
    return c.json({
      status: "success",
      message: "Following Retrieved",
      data: {
        followers,
      },
    });
  }

  if (profile.profile == UserType.PRIVATE) {
    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: profileId,
        isFollowing: true,
      },
    });

    if (!isFollowing) {
      return c.json({
        status: "success",
        message: "Follow the person to view their profile",
      });
    }

    return c.json({
      status: "success",
      message: "Following Retrieved",
      data: {
        followers,
      },
    });
  }
};

export const otherFollowing = async (c: Context) => {
  const { userId } = c.get("userId");
  const { profileId } = c.req.param();

  const prisma = getPrisma(c);
  const profile = await findProfile(prisma, profileId);

  if (!profile) {
    return c.json({
      status: "error",
      message: "Profile not found",
    });
  }

  const followings = await getFollowing(prisma, userId);

  if (profile.profile == UserType.PUBLIC) {
    return c.json({
      status: "success",
      message: "Following Retrieved",
      data: {
        followings,
      },
    });
  }

  if (profile.profile == UserType.PRIVATE) {
    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: profileId,
        isFollowing: true,
      },
    });

    if (!isFollowing) {
      return c.json({
        status: "success",
        message: "Follow the person to view their profile",
      });
    }

    return c.json({
      status: "success",
      message: "Following Retrieved",
      data: {
        followings,
      },
    });
  }
};

export const deleteProfile = async (c: Context) => {
  const prisma = getPrisma(c);
  const { userId } = c.get("user");
  await prisma.user.update({
    where: {
      userId,
    },
    data: {
      isDeleted: false,
    },
  });

  return c.json({
    status: "success",
    message: "Id deleted",
  });
};

export const profilePic = async (c: Context) => {};
