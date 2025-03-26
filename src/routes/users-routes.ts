import { Hono } from "hono";
import { prismaClient } from "../extras/prisma";
import { tokenMiddleware } from "./middlewares/token-middlewares";
import { GetMeError } from "../controllers/users/user-type";
import { getMe } from "../controllers/users/users-controller";

export const usersRoutes = new Hono();

usersRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId");

  try {
    const user = await getMe({
      userId,
    });

    return context.json(
      {
        data: user,
      },
      200
    );
  } catch (e) {
    if (e === GetMeError.BAD_REQUEST) {
      return context.json(
        {
          error: "User not found",
        },
        400
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

usersRoutes.get("/all", tokenMiddleware, async (c) => {
  try {
    const users = await getAllUser();
    return c.json(users, 200);
  } catch (e) {
    if (e === GetAllUserError.UNKNOWN) {
      return c.json({ error: "Unknown error" }, 500);
    }

    return c.json({ message: "Internal Server Error" }, 500);
  }
});
