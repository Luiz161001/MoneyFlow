import { config } from "dotenv";
import type { SignOptions } from "jsonwebtoken";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
  JWT_EXPIRES_IN: JWT_EXPIRES_IN_RAW,
  CLIENT_URL,
} = process.env;

export const JWT_EXPIRES_IN = JWT_EXPIRES_IN_RAW as SignOptions["expiresIn"];