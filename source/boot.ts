import { Elysia } from "elysia";

export const app = new Elysia({ prefix: "/api" })
  .listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
