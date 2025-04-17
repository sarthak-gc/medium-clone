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
import { BlogType, ReactionType, UserType } from "../generated/prisma";

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

  let startFrom = c.req.query("startFrom");

  if (!startFrom) {
    startFrom = "0";
  }
  if (isNaN(parseInt(startFrom))) {
    startFrom = "0";
  }
  console.log("hi", startFrom);

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
        userBlogs = await getPostsForFollower(
          prisma,
          profileId,
          parseInt(startFrom)
        );
      } else {
        userBlogs = await getPostsForPublic(
          prisma,
          profileId,
          parseInt(startFrom)
        );
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
  if (followingId === follower.userId) {
    return c.json({
      status: "error",
      message: "you cannot perform this action with your own profile",
    });
  }
  const followingPreviouslyUnfollowed = await prisma.follow.findFirst({
    where: {
      followingId,
      followerId: follower.userId,
      isFollowing: false,
    },
  });
  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId: follower.userId,
      followingId,
      isFollowing: true,
    },
  });

  if (isFollowing) {
    return c.json({
      status: "error",
      message: "you are already following this profile",
    });
  }
  if (followingPreviouslyUnfollowed) {
    await followAgain(prisma, followingPreviouslyUnfollowed.followId);
  } else {
    await newFollow(prisma, follower.userId, followingId);
  }

  return c.json({
    status: "success",
    message: "followed successfully",
  });
};

export const unfollow = async (c: Context) => {
  const follower = c.get("user");

  const { profileId: followingId } = c.req.param();

  if (followingId === follower.userId) {
    return c.json({
      status: "error",
      message: "you cannot perform this action with your own profile",
    });
  }
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

  await removeFollow(prisma, follows.followId);

  return c.json({
    status: "success",
    message: "unfollowed successfully",
  });
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
    include: {
      Following: {
        select: {
          username: true,
        },
      },
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

export const searchUser = async (c: Context) => {
  const query = c.req.query("query");
  const userDetails = c.get("userDetails");
  const { skip } = c.req.param();

  const startFrom = parseInt(skip);

  if (isNaN(startFrom)) {
    return c.json({
      status: "error",
      message: "Invalid starting index",
    });
  }

  if (!query) {
    return c.json({
      status: "error",
      message: "No keyword found",
    });
  }

  console.log(query);

  const prisma = getPrisma(c);

  const users = await prisma.user.findMany({
    skip: startFrom,
    take: 10,

    where: {
      username: {
        contains: query,
      },
      isDeleted: false,
      profile: "PUBLIC",
      NOT: { username: userDetails.username },
    },
    select: {
      email: true,
      profile: true,
      profilePic: true,
      userId: true,
      username: true,
    },
  });

  return c.json({
    status: "success",
    message: "",
    data: {
      users,
    },
  });
};

import { faker } from "@faker-js/faker";

export const seedData = async (c: Context) => {
  const prisma = getPrisma(c);
  const users = [];

  // Step 1: Create 10 users
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profile: UserType.PUBLIC,
      },
    });
    users.push(user);
  }

  console.log("10 users created");

  // Step 2: Random followings
  for (const user of users) {
    const followCount = faker.number.int({ min: 1, max: 5 });
    const toFollow = users
      .filter((u) => u.userId !== user.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, followCount);

    for (const follow of toFollow) {
      await prisma.follow.create({
        data: {
          followerId: user.userId,
          followingId: follow.userId,
        },
      });
    }
  }

  console.log("random followings added");

  const blogs = [];

  // Step 3: Each user creates 4 blogs
  for (const user of users) {
    for (let i = 0; i < 4; i++) {
      const contentLength = faker.number.int({ min: 20, max: 100 });
      const blog = await prisma.blog.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.text().slice(0, contentLength),
          authorId: user.userId,
          visibility:
            i === 0
              ? BlogType.DRAFT
              : i % 3 === 0
              ? BlogType.PRIVATE
              : BlogType.PUBLIC,
        },
      });
      blogs.push(blog);
    }
  }

  console.log("blogs created");

  // Step 4: Each blog gets 2 random reactions
  for (const blog of blogs) {
    const reactedUsers = new Set();
    while (reactedUsers.size < 2) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      if (reactedUsers.has(user.userId)) continue;

      reactedUsers.add(user.userId);
      const reactionType =
        Object.values(ReactionType)[
          faker.number.int({
            min: 0,
            max: Object.values(ReactionType).length - 1,
          })
        ];

      await prisma.reactions.create({
        data: {
          type: reactionType,
          userId: user.userId,
          blogId: blog.blogId,
        },
      });
    }
  }

  console.log("reactions added");

  // Step 5: Random comments (0–10) per blog
  for (const blog of blogs) {
    const commentCount = faker.number.int({ min: 0, max: 10 });
    for (let i = 0; i < commentCount; i++) {
      const commenter =
        users[faker.number.int({ min: 0, max: users.length - 1 })];
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          commenterId: commenter.userId,
          blogId: blog.blogId,
        },
      });
    }
  }

  console.log("comments added");

  return c.json({ msg: "Quick seeding completed successfully" });
};

export const unSeedData = async (c: Context) => {
  const prisma = getPrisma(c);
  await prisma.comment.deleteMany();
  await prisma.reactions.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();
  return c.json({ msg: "Seeding completed successfully" });
};
