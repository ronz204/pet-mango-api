import { env } from "@env";
import { Elysia } from "elysia";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const name: string = "prisma.plugin";
const url = env.POSTGRES_URL;

export const PrismaPlugin = new Elysia({ name })
  .decorate(() => {
    const adapter = new PrismaPg({ connectionString: url });
    const prisma = new PrismaClient({ adapter });

    return { prisma };
  });
