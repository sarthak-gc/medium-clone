import { Context } from "hono";
import { BlogType, PrismaClient, ReactionType } from "../generated/prisma";

export const addBlog = async (
  prisma: PrismaClient,
  title: string,
  content: string,
  authorId: string,
  visibility: BlogType
) => {
  await prisma.blog.create({
    data: {
      title,
      content,
      authorId,
      visibility,
    },
  });
};

export const removeReaction = async (
  prisma: PrismaClient,
  userId: string,
  blogId: string
) => {
  await prisma.$transaction([
    prisma.blog.update({
      where: {
        blogId,
      },
      data: {
        reactions: {
          decrement: 1,
        },
      },
    }),

    prisma.reactions.delete({
      where: {
        blogId_userId: { blogId, userId },
      },
    }),
  ]);
};

export const changeReaction = async (
  prisma: PrismaClient,
  userId: string,
  blogId: string,
  type: ReactionType
) => {
  await prisma.reactions.update({
    where: {
      blogId_userId: {
        blogId,
        userId: userId,
      },
    },
    data: {
      type: type,
    },
  });
};
export const addReaction = async (
  prisma: PrismaClient,
  userId: string,
  blogId: string,
  type: ReactionType
) => {
  await prisma.$transaction([
    prisma.blog.update({
      where: {
        blogId,
      },
      data: {
        reactions: {
          increment: 1,
        },
      },
    }),
    prisma.reactions.create({
      data: {
        userId,
        blogId,
        type,
      },
    }),
  ]);
};

export const addComment = async (
  prisma: PrismaClient,
  blogId: string,
  userId: string,
  comment: string
) => {
  await prisma.comment.create({
    data: {
      content: comment,
      blogId,
      commenterId: userId,
    },
  });
};

export const addReply = async (
  prisma: PrismaClient,
  blogId: string,
  userId: string,
  comment: string,
  parentId: string
) => {
  await prisma.comment.create({
    data: {
      content: comment,
      blogId,
      commenterId: userId,
      parentId,
    },
  });
};

// ------------------------------search existing------------------------------

export const findBlog = async (prisma: PrismaClient, blogId: string) => {
  const blog = await prisma.blog.findFirst({
    where: {
      blogId,
    },
  });
  return blog;
};

export const findReaction = async (
  prisma: PrismaClient,
  userId: string,
  blogId: string
) => {
  const reaction = await prisma.reactions.findFirst({
    where: {
      userId,
      blogId,
    },
  });
  return reaction;
};

export const findComment = async (prisma: PrismaClient, commentId: string) => {
  const comment = await prisma.comment.findFirst({
    where: {
      commentId,
    },
  });
  return comment;
};

// ------------------------------input validations------------------------------

export const getValidComment = (comment: string) => {
  if (String(comment).trim()) {
    return String(comment).trim();
  } else {
    throw Error("Empty Comment");
  }
};

export const getValidVisibility = (
  c: Context,
  visibility: string,
  userProfile: string
) => {
  const visibilityMap = new Map([
    ["public", BlogType.PUBLIC],
    ["private", BlogType.PRIVATE],
    ["draft", BlogType.DRAFT],
  ]);

  visibility = visibility.trim().toLowerCase();
  if (!visibility) {
    return userProfile === "PUBLIC" ? BlogType.PUBLIC : BlogType.PRIVATE;
  } else if (visibilityMap.has(visibility)) {
    return visibilityMap.get(visibility)!;
  } else {
    throw Error("Invalid Visibility");
  }
};

export const getValidReaction = (c: Context, type: string) => {
  const reactionMap = new Map([
    ["angry", ReactionType.ANGRY],
    ["dislike", ReactionType.DISLIKE],
    ["heart", ReactionType.HEART],
    ["laugh", ReactionType.LAUGH],
    ["like", ReactionType.LIKE],
  ]);

  type = String(type).trim().toLowerCase();

  if (!reactionMap.get(type)) {
    c.status(400);
    throw Error("Invalid reaction");
  }

  return reactionMap.get(type);
};
