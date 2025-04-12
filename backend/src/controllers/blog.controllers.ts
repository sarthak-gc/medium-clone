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
    console.log(e);
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
  const blog = await findBlog(prisma, blogId);
  if (!blog) {
    return c.json({
      status: "error",
      message: "blog not found",
    });
  }

  const reaction = await findReaction(prisma, userId, blogId);

  if (reaction) {
    if (reaction.type === type) {
      removeReaction(prisma, userId, blogId);
      return c.json({
        status: "success",
        message: "reaction removed",
      });
    } else {
      changeReaction(prisma, userId, blogId, type);
      return c.json({
        status: "success",
        message: "reaction changed",
      });
    }
  }
  addReaction(prisma, userId, blogId, type);
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
  const blog = await findBlog(prisma, blogId);
  if (!blog) {
    return c.json({
      status: "error",
      message: "blog not found",
    });
  }

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
  return c.json({ message: "specific blog" });
};

export const getPublicBlogs = async (c: Context) => {
  const prisma = getPrisma(c);
  const blogs = await prisma.blog.findMany({
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
  justDeleteComment(prisma, commentId);

  return c.json({
    status: "success",
    message: "Deleted Comment",
  });
};
