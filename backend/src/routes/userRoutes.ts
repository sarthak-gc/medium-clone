import { Hono } from "hono";
import {
  signIn,
  signUp,
  getProfile,
  updatePassword,
  logout,
  follow,
  unfollow,
  getSelfFollowers,
  getSelfFollowing,
  otherFollowers,
  otherFollowing,
  deleteProfile,
  searchUser,
  // createDummyUsers,
} from "../controllers/user.controllers";
import { authenticationMiddleware } from "../middleware/authMiddleware";

// import { pictureUploadMiddleware } from "../middleware/pictureUploadMiddlware";

const userRoutes = new Hono();

// userRoutes.post("/seedData", seedData);
// userRoutes.post("/unSeedData", unSeedData);
userRoutes.post("/signup", signUp);
userRoutes.post("/signin", signIn);

userRoutes.use(authenticationMiddleware);

userRoutes.get("/userProfile/:profileId", getProfile);
userRoutes.get("/search/:skip", searchUser);
userRoutes.put("/password", updatePassword);

userRoutes.post("/follow/:profileId", follow);
userRoutes.post("/unfollow/:profileId", unfollow);

userRoutes.post("/followers/self", getSelfFollowers);
userRoutes.post("/following/self", getSelfFollowing);

userRoutes.post("/followers/:profileId", otherFollowers);
userRoutes.post("/following/:profileId", otherFollowing);
userRoutes.post("/logout", logout);

// userRoutes.put("/profile/update/picture", pictureUploadMiddleware, profilePic);

userRoutes.delete("/delete/", deleteProfile);

export default userRoutes;
