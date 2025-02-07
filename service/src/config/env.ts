import dotenv from "dotenv";

dotenv.config();

export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING!;
export const TWITTER_USERNAME = process.env.TWITTER_USERNAME!;
export const TWITTER_PASSWORD = process.env.TWITTER_PASSWORD!;
export const TWITTER_EMAIL = process.env.TWITTER_EMAIL!;
export const PROXY_URL = process.env.PROXY_URL!;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
export const HYPERBOLIC_API_KEY = process.env.HYPERBOLIC_API_KEY!;

if (
  !DB_CONNECTION_STRING ||
  !TWITTER_USERNAME ||
  !TWITTER_PASSWORD ||
  !TWITTER_EMAIL ||
  !PROXY_URL ||
  !OPENAI_API_KEY ||
  !HYPERBOLIC_API_KEY
) {
  console.error("Missing environment variables.");
  process.exit(1);
}
