import { Elysia } from "elysia";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { PgConfig } from "@configs/postgres.config";

const name: string = "prisma.plugin";
const url = PgConfig.POSTGRES_URL;

export const PrismaPlugin = new Elysia({ name })
  .decorate(() => {
    const adapter = new PrismaPg({ connectionString: url });
    const prisma = new PrismaClient({ adapter });

    return { prisma };
  });
