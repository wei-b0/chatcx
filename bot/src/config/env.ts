import dotenv from "dotenv";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const API_URL = process.env.API_URL!;
export const API_KEY = process.env.API_KEY!;
export const DATABASE_URL = process.env.DB_CONNECTION_STRING!;
export const MAX_CREDITS = 5;

if (!BOT_TOKEN || !API_URL || !API_KEY || !DATABASE_URL) {
  console.error("Missing environment variables.");
  process.exit(1);
}
