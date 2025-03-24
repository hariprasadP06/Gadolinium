import { Hono } from "hono";
import { signUpWithUsernameAndPassword } from "../controllers/authentication";
import { SignUpWithUsernameAndPasswordError } from "../controllers/authentication/+type";

export const hono = new Hono();

hono.post("/authentication/sign-up", async (c) => {
  const { username, password } = await c.req.json();
  try {
    const result = await signUpWithUsernameAndPassword({
      username,
      password,
    });

    return c.json({ data: result }, 201);
  } catch (e) {
    // Handle SignUpWithUsernameAndPasswordError
    //handle generic error

    if (e == SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return c.json(
        {
          error: "Username already exists",
        },
        409
      );
    }

    if (e == SignUpWithUsernameAndPasswordError.UNKNOWN) {
      return c.json(
        {
          message: "Unknown",
        },
        500
      );
    }
  }
});

hono.get("/health", (context) => {
  return context.json(
    {
      message: "All Ok",
    },
    200
  );
});
