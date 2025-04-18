import { Hono } from "hono";
import {
  commentOnBlog,
  createBlog,
  getGlobalFeed,
  getBlog,
  reactBlog,
  replyToComment,
  getUserBlog,
  getPersonalBlogs,
  updateBlog,
  editComment,
  deleteComment,
  deleteBlog,
  getBlogComments,
  getDrafts,
  getFollowingFeed,
  getReactions,
  searchBlogs,
} from "../controllers/blog.controllers";
import { authenticationMiddleware } from "../middleware/authMiddleware";
import { publicAccessMiddleware } from "../middleware/publicAccessMiddleware";
import { visibilityMiddleware } from "../middleware/blogVisibility";

const blogRouter = new Hono();

blogRouter.get("/public", publicAccessMiddleware, getGlobalFeed);

blogRouter.use(authenticationMiddleware);

blogRouter.post("/create", createBlog);
blogRouter.get("/followings", getFollowingFeed);

blogRouter.get("/user/:profileId/all", getUserBlog);

blogRouter.put("/:blogId/edit", updateBlog);
blogRouter.put("/comment/:commentId/edit", editComment);
blogRouter.put("/reply/:commentId/edit", editComment);

blogRouter.delete("/:blogId", deleteBlog);
blogRouter.delete("/comment/:commentId", deleteComment);
blogRouter.delete("/reply/:replyId", deleteComment);
blogRouter.get("/self/all", getPersonalBlogs);

blogRouter.post("/:commentId/reply", replyToComment);
blogRouter.get("/drafts", getDrafts);
blogRouter.get("/search/:skip", searchBlogs);

blogRouter.post("/:blogId/react", visibilityMiddleware, reactBlog);
blogRouter.post("/:blogId/comment", visibilityMiddleware, commentOnBlog);
blogRouter.get("/:blogId/comments/", visibilityMiddleware, getBlogComments);
blogRouter.get("/:blogId/reactions", getReactions);
blogRouter.get("/:blogId", visibilityMiddleware, getBlog);

export default blogRouter;
