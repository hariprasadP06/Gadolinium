import { Hono } from "hono";
import {
  logInWithUsernameAndPassword,
  signUpWithUsernameAndPassword,
} from "../controllers/authentication";
import {
  LogInWtihUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
} from "../controllers/authentication/+type";
import { authenticationRoutes } from "./authentication-route";
import { prismaClient } from "../extras/prisma";
import { Console } from "console";
import { createContext } from "vm";
import { jwtSecretKey } from "../../environment";
import jwt from "jsonwebtoken";

export const allRoutes = new Hono();

// allRoutes.use(async (c) => {
//   console.log("HTTP METHIOD", c.req.method);
//   console.log("URL", c.req.url);
//   console.log("HEADERS", c.req.header());
// });

allRoutes.route("/authentication", authenticationRoutes);

allRoutes.get(
  "/user",
  async (c, next) => {
    const token = c.req.header("token");
    if (!token) {
      return c.json(
        {
          message: "Missing Token",
        },
        401
      );
    }

    try {
      const verified = jwt.verify(token, jwtSecretKey);

      await next();
    } catch (e) {
      return c.json(
        {
          message: "Invalid Token",
        },
        401
      );
    }
  },
  async (c) => {
    const user = await prismaClient.user.findMany();
    return c.json(user, 200);
  }
);
allRoutes.get(
  "/health",
  async (context, next) => {
    console.log("HTTP METHIOD", context.req.method);
    console.log("URL", context.req.url);
    console.log("HEADERS", context.req.header());
    const authorization = context.req.header("Authorization");

    if (!authorization) {
      return context.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    next();
  },
  (context) => {
    console.log("Health Checked");
    return context.json(
      {
        message: "All Ok",
      },
      200
    );
  }
);
function next() {
  throw new Error("Function not implemented.");
}
