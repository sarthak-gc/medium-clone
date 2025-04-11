import { Hono } from "hono";
import { createBlog } from "../controllers/blog.controllers";
import { authenticationMiddleware } from "../middleware/authMiddleware";

const blogRouter = new Hono();

blogRouter.post("/create", authenticationMiddleware, createBlog);

blogRouter.put("/", async (c) => {
  return c.text("updated");
});

blogRouter.get("/following/:userId", async (c) => {
  return c.text("retrieved user details");
});

blogRouter.get("/all", async (c) => {
  return c.text("retrieved all");
});

blogRouter.get("/:blogId", async (c) => {
  return c.text(" retrieved");
});
export default blogRouter;
