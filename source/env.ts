import { z } from "zod";

const envSchema = z.object({
  // ==========================================
  // Application Config
  // ==========================================
  APP_VERSION: z.string().default("1.0.0"),
  APP_NAME: z.string().default("Mango API"),
  APP_PORT: z.string().transform((val) => parseInt(val, 10)).default(3000),

  // ==========================================
  // PostgreSQL Config
  // ==========================================
  POSTGRES_DB: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().transform((val) => parseInt(val, 10)).default(5432),

  // ==========================================
  // Redis & Cache Config
  // ==========================================
  REDIS_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform((val) => parseInt(val, 10)).default(6379),

  // ==========================================
  // Security Config
  // ==========================================
  SECRET_KEY: z.string(),
  CORS_ORIGIN: z.string().transform((val) => val.split(",").map((origin) => origin.trim())),
});

export const env = envSchema.parse(process.env);
