// import { v2 as cloudinary } from "cloudinary";
import { Context, Next } from "hono";

export const pictureUploadMiddleware = async (c: Context, next: Next) => {
  const body = await c.req.parseBody();
  console.log(body, " THIS IS ANOTHER TEST");
  // cloudinary.config({
  //   cloud_name: c.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: c.env.CLOUDINARY_API_KEY,
  //   api_secret: c.env.CLOUDINARY_API_SECRET,
  // });

  await next();
};

// import { encodeBase64 } from "hono/utils/encode";

// router.post("/upload", async (c) => {
//   console.log(c.req);
//   console.log(" \n yo ", body, " yo \n");
//   const image = body["image"] as File;
//   console.log(" \n yo ", image, " yo \n");

//   return c.text("base64");
// });

// const byteArrayBuffer = await image.arrayBuffer();
// console.log(" \n yo ", byteArrayBuffer, " yo \n");

// const base64 = encodeBase64(byteArrayBuffer);
// const results = await cloudinary.uploader.upload(
//   `data:image/png;base64,${base64}`
// );
// console.log(results);
// return c.json(results);
// return c.json(base64);
