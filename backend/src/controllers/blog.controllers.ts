import { Context } from "hono";
import { getPrisma } from "../utils/generatePrisma";
import {
  addBlog,
  addComment,
  addReaction,
  addReply,
  changeBlogContent,
  changeReaction,
  findBlog,
  findComment,
  findReaction,
  getComments,
  getSelfBlogs,
  getUserBlogs,
  getValidComment,
  getValidReaction,
  getValidVisibility,
  justDeleteBlog,
  justDeleteComment,
  removeReaction,
  updateComment,
} from "../utils/blogs";
import { handleError } from "../utils/handleError";
import { BlogType } from "../generated/prisma";
import { getFollowing } from "../utils/users";

export const createBlog = async (c: Context) => {
  const body = await c.req.json();
  const user = c.get("user");
  const userDetails = c.get("userDetails");
  const { title, content } = body;
  let { visibility = "" } = body;

  try {
    visibility = getValidVisibility(c, visibility, userDetails.profile);
    const prisma = getPrisma(c);

    const blogAdded = await addBlog(
      prisma,
      title,
      content,
      user.userId,
      visibility
    );

    return c.json({
      status: "success",
      message: "Blog Added Successfully",
      data: {
        blogAdded,
      },
    });
  } catch (e) {
    return handleError(e, c);
  }
};

export const reactBlog = async (c: Context) => {
  const { blogId } = c.req.param();
  const { userId } = c.get("user");

  const body = await c.req.json();

  let { type = "" } = body;

  try {
    type = getValidReaction(c, type);
  } catch (e) {
    return handleError(e, c);
  }
  const prisma = getPrisma(c);
  const reaction = await findReaction(prisma, userId, blogId);

  if (reaction) {
    if (reaction.type === type) {
      await removeReaction(prisma, userId, blogId);
      return c.json({
        status: "success",
        message: "reaction removed",
      });
    } else {
      await changeReaction(prisma, userId, blogId, type);
      return c.json({
        status: "success",
        message: "reaction changed",
      });
    }
  }
  await addReaction(prisma, userId, blogId, type);
  return c.json({ status: "success", message: "Reacted to the Blog" });
};

export const commentOnBlog = async (c: Context) => {
  const { blogId } = c.req.param();
  const { userId } = c.get("user");
  let { comment } = await c.req.json();
  try {
    comment = getValidComment(comment);
  } catch (e) {
    return handleError(e, c);
  }

  const prisma = getPrisma(c);
  addComment(prisma, blogId, userId, comment);
  return c.json({ status: "success", message: "Comment posted" });
};

export const replyToComment = async (c: Context) => {
  const { commentId } = c.req.param();
  let { comment } = await c.req.json();

  try {
    comment = getValidComment(comment);

    const prisma = getPrisma(c);
    const parentComment = await findComment(prisma, commentId);

    if (!parentComment) {
      return c.json({
        status: "error",
        message: "Can't find the comment",
      });
    }
    const { userId } = c.get("user");
    const { blogId } = parentComment;

    addReply(prisma, blogId, userId, comment, commentId);

    return c.json({
      status: "success",
      message: "replied to the comment",
    });
  } catch (e) {
    return handleError(e, c);
  }
};

export const getBlog = async (c: Context) => {
  const blogs = c.get("blog");
  return c.json({
    status: "success",
    message: "Blogs Retrieved",
    data: {
      blogs,
    },
  });
};
export const getGlobalFeed = async (c: Context) => {
  const prisma = getPrisma(c);
  let startFrom = c.req.query("startFrom");
  console.log(startFrom, " OUTSIDE");

  if (!startFrom) {
    startFrom = "0";
  }
  if (isNaN(parseInt(startFrom))) {
    console.log(startFrom, "Start from");

    startFrom = "0";
  }
  const blogs = await prisma.blog.findMany({
    skip: parseInt(startFrom),
    take: 8,
    where: {
      visibility: "PUBLIC",
      isDeleted: false,
    },
    select: {
      blogId: true,
      title: true,
      content: true,
      authorId: true,
      reactions: true,
      createdAt: true,
      Comment: {
        select: {
          createdAt: true,
          isUpdated: true,
          parentId: true,
          commentId: true,
          User: {
            select: {
              username: true,
            },
          },
          content: true,
        },
      },
      User: {
        select: {
          username: true,
        },
      },
      Reactions: {
        select: {
          User: {
            select: {
              userId: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      reactions: "desc",
    },
  });
  return c.json({
    message: "Blogs Retrieved",
    data: {
      blogs,
    },
  });
};

export const getFollowingFeed = async (c: Context) => {
  const { userId } = c.get("user");
  const prisma = getPrisma(c);

  const followingIds = await getFollowing(prisma, userId);

  const followIds = followingIds.map((follow) => follow.followingId);

  const blogs = await prisma.blog.findMany({
    where: {
      isDeleted: false,
      visibility: "PUBLIC",

      authorId: {
        in: followIds,
      },
    },
    select: {
      blogId: true,
      title: true,
      content: true,
      authorId: true,
      reactions: true,
    },
    orderBy: {
      reactions: "desc",
    },
  });

  return c.json({
    message: "Blogs Retrieved",
    data: {
      blogs,
    },
  });
};
export const getUserBlog = async (c: Context) => {
  const { profileId } = c.req.param();

  const prisma = getPrisma(c);

  try {
    const blogs = await getUserBlogs(prisma, profileId);
    return c.json({
      status: "error",
      message: "blogs retrieved",
      data: { blogs },
    });
  } catch (e) {
    return handleError(e, c);
  }
};
export const getPersonalBlogs = async (c: Context) => {
  const { userId } = c.get("user");
  const prisma = getPrisma(c);

  try {
    const blogs = await getSelfBlogs(prisma, userId);
    return c.json({ blogs });
  } catch (e) {
    return handleError(e, c);
  }
};

export const updateBlog = async (c: Context) => {
  const { userId } = c.get("user");

  const { blogId } = c.req.param();
  const prisma = getPrisma(c);
  const blog = await findBlog(prisma, blogId);

  const { content } = await c.req.json();
  if (!blog) {
    return c.json({
      status: "error",
      message: "No blog to update",
    });
  }

  const isAuthor = userId === blog.authorId;
  if (!isAuthor) {
    return c.json({
      status: "error",
      message: "Unauthorized to edit the post",
    });
  }

  if (blog.visibility !== BlogType.DRAFT) {
    return c.json({
      status: "error",
      message: "Cannot update published blog",
    });
  }

  changeBlogContent(prisma, blogId, content);

  return c.json({
    status: "success",
    message: "Updated Blog",
  });
};

export const editComment = async (c: Context) => {
  const { userId } = c.get("user");

  const { commentId } = c.req.param();
  const { content } = await c.req.json();

  const prisma = getPrisma(c);
  const comment = await findComment(prisma, commentId);
  if (!comment) {
    return c.json({
      status: "error",
      message: "No comment to edit",
    });
  }
  const isAuthor = userId === comment.commenterId;
  if (!isAuthor) {
    return c.json({
      status: "error",
      message: "Unauthorized to edit the comment",
    });
  }

  updateComment(prisma, commentId, content);
};

export const deleteBlog = async (c: Context) => {
  const { userId } = c.get("user");

  const { blogId } = c.req.param();
  const prisma = getPrisma(c);
  const blog = await findBlog(prisma, blogId);

  if (!blog) {
    return c.json({
      status: "error",
      message: "No blog to update",
    });
  }

  const isAuthor = userId === blog.authorId;
  if (!isAuthor) {
    return c.json({
      status: "error",
      message: "Unauthorized to delete the post",
    });
  }

  justDeleteBlog(prisma, blogId);

  return c.json({
    status: "success",
    message: "Deleted Blog",
  });
};

export const deleteComment = async (c: Context) => {
  const { userId } = c.get("user");

  const { commentId } = c.req.param();

  const prisma = getPrisma(c);
  const comment = await findComment(prisma, commentId);
  if (!comment) {
    return c.json({
      status: "error",
      message: "No comment to edit",
    });
  }
  const isAuthor = userId === comment.commenterId;
  if (!isAuthor) {
    return c.json({
      status: "error",
      message: "Unauthorized to edit the comment",
    });
  }
  justDeleteComment(prisma, commentId);

  return c.json({
    status: "success",
    message: "Deleted Comment",
  });
};

export const getBlogComments = async (c: Context) => {
  const { userId } = c.get("user");
  const { blogId } = c.req.param();

  const prisma = getPrisma(c);
  const blog = await findBlog(prisma, blogId);

  if (!blog) {
    return c.json({
      status: "error",
      message: "Blog not found",
    });
  }

  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: blog.authorId,
      isFollowing: true,
    },
  });

  const comments = await getComments(prisma, blogId);

  if (isFollowing) {
    return c.json({
      status: "success",
      message: "Comments retrieved",
      data: {
        comments,
      },
    });
  }

  if (blog.visibility === "PUBLIC") {
    return c.json({
      status: "success",
      message: "Comments retrieved",
    });
  }

  return c.json({
    status: "error",
    message: "Follow the author to view comment",
  });
};

export const getReactions = async (c: Context) => {
  const { blogId } = c.req.param();

  const prisma = getPrisma(c);
  const reactions = await prisma.reactions.findMany({
    where: {
      blogId,
    },
  });
  return c.json({
    reactions,
    count: reactions.length,
  });
};

export const getDrafts = async (c: Context) => {
  const { userId } = c.get("user");

  const prisma = getPrisma(c);

  const draftBlogs = await prisma.blog.findMany({
    where: {
      authorId: userId,
      visibility: "DRAFT",
    },
  });

  return c.json({
    status: "success",
    message: "draft  retrieved",
    data: {
      blogs: draftBlogs,
    },
  });
};

export const searchBlogs = async (c: Context) => {
  const query = c.req.query("query");
  const { skip } = c.req.param();

  const startFrom = isNaN(parseInt(skip)) ? 0 : parseInt(skip);

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
  const userDetails = c.get("userDetails");

  const prisma = getPrisma(c);

  const blogs = await prisma.blog.findMany({
    skip: startFrom,
    take: 5,
    where: {
      OR: [
        {
          title: { contains: query },
        },
        { content: { contains: query } },
      ],
      NOT: { authorId: userDetails.userId },
    },
    orderBy: {
      reactions: "desc",
    },
  });

  return c.json({
    blogs,
  });
};
