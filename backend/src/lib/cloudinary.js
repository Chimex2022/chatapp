import { v2 as cloudinary } from "cloudinary";

// import { config } from "dotenv";

// config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: "dbs0zbvwx",
  api_key: "444612992778394",
  api_secret: "y04STZinKN43q6_Lm3Du0O838Qs",
});

export default cloudinary;
