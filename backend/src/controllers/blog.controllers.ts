import { Context } from "hono";
import { PostType, UserType } from "../generated/prisma/edge";
import { getPrisma } from "../utils/generatePrisma";

export const createBlog = async (c: Context) => {
  const body = await c.req.json();
  const user = c.get("user");
  const userDetails = c.get("userDetails");

  const { title, content } = body;
  let { visibility = "" } = body;

  const visibilityMap = new Map([
    ["public", PostType.PUBLIC],
    ["private", PostType.PRIVATE],
    ["draft", PostType.DRAFT],
  ]);

  visibility = visibility.trim().toLowerCase();
  if (!visibility) {
    visibility =
      userDetails.profile === "PUBLIC" ? PostType.PUBLIC : PostType.PRIVATE;
  } else if (visibilityMap.has(visibility)) {
    visibility = visibilityMap.get(visibility)!;
  } else {
    c.status(400);
    return c.json({
      status: "error",
      message: "Invalid Visibility",
    });
  }
  const prisma = getPrisma(c);
  try {
    const blogAdded = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.userId,
        visibility,
      },
    });

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
