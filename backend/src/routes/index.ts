import { Hono } from "hono";
import userRoutes from "./userRoutes";
import blogRouter from "./blogRoutes";

// import { v2 as cloudinary } from "cloudinary";

// import { encodeBase64 } from "hono/utils/encode";

const router = new Hono<{
  Bindings: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
}>();

// router.use(async (_c, next) => {
//   cloudinary.config({
//     cloud_name: _c.env.CLOUDINARY_CLOUD_NAME,
//     api_key: _c.env.CLOUDINARY_API_KEY,
//     api_secret: _c.env.CLOUDINARY_API_SECRET,
//   });

//   await next();
// });
router.route("/user", userRoutes);
router.route("/blog", blogRouter);

router.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  console.log(c.req);
  console.log(" \n yo ", body, " yo \n");
  const image = body["image"] as File;
  console.log(" \n yo ", image, " yo \n");
  // const byteArrayBuffer = await image.arrayBuffer();
  // console.log(" \n yo ", byteArrayBuffer, " yo \n");

  // const base64 = encodeBase64(byteArrayBuffer);
  // const results = await cloudinary.uploader.upload(
  //   `data:image/png;base64,${base64}`
  // );
  // console.log(results);
  // return c.json(results);
  // return c.json(base64);
  return c.text("base64");
});

export default router;
