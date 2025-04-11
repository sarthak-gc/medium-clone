import { Hono } from "hono";
import {
  signIn,
  signUp,
  getProfile,
  updatePassword,
  logout,
  follow,
} from "../controllers/user.controllers";
import { authenticationMiddleware } from "../middleware/authMiddleware";

const userRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET_REFRESH_TOKEN: string;
    JWT_SECRET_ACCESS_TOKEN: string;
  };
}>();

userRoutes.post("/signup", signUp);
userRoutes.post("/signin", signIn);

userRoutes.get("/userProfile/:userId", authenticationMiddleware, getProfile);
userRoutes.put("/password", authenticationMiddleware, updatePassword);
userRoutes.post("/follow/:userId", authenticationMiddleware, follow);
userRoutes.post("/logout", authenticationMiddleware, logout);

export default userRoutes;
