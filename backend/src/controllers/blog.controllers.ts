import { Context } from "hono";
import { getPrisma } from "../utils/generatePrisma";
import {
  addBlog,
  addComment,
  addReaction,
  addReply,
  changeReaction,
  findBlog,
  findComment,
  findReaction,
  getValidComment,
  getValidReaction,
  getValidVisibility,
  removeReaction,
} from "../utils/blogs";

export const createBlog = async (c: Context) => {
  const body = await c.req.json();
  const user = c.get("user");
  const userDetails = c.get("userDetails");
  const { title, content } = body;
  let { visibility = "" } = body;

  try {
    visibility = getValidVisibility(c, visibility, userDetails.profile);
  } catch (e) {
    console.log(e);
    c.status(400);
    if (e instanceof Error)
      return c.json({
        status: "error",
        message: e.message,
      });
  }
  const prisma = getPrisma(c);

  try {
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
    return c.json({
      status: "error",
      message: "Unexpected error",
    });
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
    console.log(e);
    if (e instanceof Error)
      return c.json({
        status: "error",
        message: e.message,
      });
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
    console.log(e);
    if (e instanceof Error)
      return c.json({
        status: "error",
        message: e.message,
      });
  }

  const prisma = getPrisma(c);
  const blog = await findBlog(prisma, blogId);
  if (!blog) {
    return c.json({
      status: "error",
      message: "blog not found",
    });
  }

  const postComment = await addComment(prisma, blogId, userId, comment);

  return c.json({ status: "success", message: "Comment posted" });
};

export const replyToComment = async (c: Context) => {
  const { commentId } = c.req.param();
  let { comment } = await c.req.json();

  try {
    comment = getValidComment(comment);
  } catch (e) {
    console.log(e);
    if (e instanceof Error)
      return c.json({
        status: "error",
        message: e.message,
      });
  }

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

  const reply = await addReply(prisma, blogId, userId, comment, commentId);

  return c.json({
    comment: reply,
  });
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
