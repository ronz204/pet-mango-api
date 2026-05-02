import { z } from "zod";

const envSchema = z.object({
  POSTGRES_DB: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().transform((val) => parseInt(val, 10)),
});

export const PgConfig = envSchema.parse(process.env);
