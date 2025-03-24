// import jwt from "jsonwebtoken";
// import "dotenv/config";

// const payload: jwt.JwtPayload = {
//   iss: "https://github.com/hariprasadP06",
//   sub: "hariprasadP06",
// };
// const secretKey = process.env.VERY_SECRET_KEY || process.exit(1);
// console.log(secretKey);

// const token = jwt.sign(payload, secretKey, {
//   algorithm:"HS256",
//   // expiresIn: "7d",
// });


// console.log("Token:",token);

// try{
// const decodePayload = jwt.verify(token, secretKey);

// console.log("Decode Payload:",decodePayload);
// }
// catch(error){
//   console.log("Error:",error);
// };


import "dotenv/config";
import { hono } from "./routes";
import {serve} from "@hono/node-server";

serve(hono, (info) => {
  console.log(`server is running on port ${info.port}`);
})