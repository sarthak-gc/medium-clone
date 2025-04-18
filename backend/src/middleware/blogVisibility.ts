import { Context, Next } from "hono";
import { getPrisma } from "../utils/generatePrisma";
import { findBlog } from "../utils/blogs";

export const visibilityMiddleware = async (c: Context, next: Next) => {
  const { blogId } = c.req.param();
  const user = c.get("user");
  const userId = user?.userId;
  const prisma = getPrisma(c);
  const blog = await findBlog(prisma, blogId);

  if (!blog) {
    return c.json({
      status: "error",
      message: "Blog Not Found",
    });
  }

  const isAuthor = blog.authorId === userId;

  if (blog.visibility === "DRAFT" && !isAuthor) {
    return c.json({
      status: "error",
      message: "Blog Not Found",
    });
  }

  if (blog.visibility === "PRIVATE" && !isAuthor) {
    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: blog.authorId,
        isFollowing: true,
      },
    });

    if (!isFollowing) {
      return c.json({ status: "error", message: "Blog Not Found" });
    }
  }

  c.set("blog", blog);
  await next();
};
