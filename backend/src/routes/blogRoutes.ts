import { Hono } from "hono";
import {
  commentOnBlog,
  createBlog,
  getPublicBlogs,
  getBlog,
  reactBlog,
  replyToComment,
  getUserBlog,
  getPersonalBlogs,
  updateBlog,
  editComment,
  deleteComment,
  deleteBlog,
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

blogRouter.get("/:blogId", getBlog);
blogRouter.get("/user/:profileId/all", getUserBlog);
blogRouter.get("/self/all", getPersonalBlogs);

blogRouter.put("/:blogId/edit", updateBlog);
blogRouter.put("/comment/:commentId/edit", editComment);
blogRouter.put("/reply/:commentId/edit", editComment);

blogRouter.delete("/:blogId", deleteBlog);
blogRouter.delete("/comment/:commentId", deleteComment);
blogRouter.delete("/reply/:replyId", deleteComment);

export default blogRouter;
