import { Hono } from "hono";

export const hono = new Hono();

hono.get("/health", (context) => {
  return context.json(
    {
      message: "All Ok",
    },
    200
  );
});