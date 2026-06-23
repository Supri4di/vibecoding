import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .post(
    "/users",
    async ({ body, set }) => {
      try {
        await registerUser(body.name, body.email, body.password);
        return { data: "OK" };
      } catch (error: any) {
        if (error.message === "Email sudah terdaftar") {
          set.status = 400;
          return { error: "Email sudah terdaftar" };
        }
        set.status = 500;
        return { error: "Terjadi kesalahan pada server", details: error.message };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/users/login",
    async ({ body, set }) => {
      try {
        const token = await loginUser(body.email, body.password);
        return { data: token };
      } catch (error: any) {
        if (error.message === "Email atau password salah") {
          set.status = 400;
          return { error: "Email atau password salah" };
        }
        set.status = 500;
        return { error: "Terjadi kesalahan pada server", details: error.message };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );

