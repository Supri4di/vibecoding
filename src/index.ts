import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(usersRoute)
  .get("/", () => ({
    message: "Welcome to Bun + Elysia + Drizzle + MySQL project!",
    endpoints: {
      "GET /": "Welcome message",
      "POST /api/users": "Registrasi user baru",
    },
  }))
  .listen(port);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
