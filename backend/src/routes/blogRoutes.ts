import { Hono } from "hono";
import {
  commentOnBlog,
  createBlog,
  getPublicBlogs,
  getBlog,
  reactBlog,
  replyToComment,
} from "../controllers/blog.controllers";
import { authenticationMiddleware } from "../middleware/authMiddleware";
import { publicAccessMiddleware } from "../middleware/publicAccessMiddleware";

const blogRouter = new Hono();

blogRouter.get("/public", publicAccessMiddleware, getPublicBlogs);

blogRouter.use(authenticationMiddleware);

blogRouter.post("/create", createBlog);
blogRouter.post("/:blogId/react", reactBlog);
blogRouter.post("/:blogId/comment", commentOnBlog);
blogRouter.post("/:commentId/reply", replyToComment);

blogRouter.use();
blogRouter.get("/:blogId", getBlog);

export default blogRouter;
