import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import { Pool } from "pg";
import { splitMessageIntoChunks } from "./utils/format";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const API_URL = process.env.API_URL!;
const API_KEY = process.env.API_KEY!;
const DATABASE_URL = process.env.DB_CONNECTION_STRING!;

if (!BOT_TOKEN || !API_URL || !API_KEY || !DATABASE_URL) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const MAX_CREDITS = 5;
const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  const userId = ctx.message.from.id;
  const username = ctx.message.from.username || "unknown";

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT credits FROM user_credits WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      await client.query(
        `INSERT INTO user_credits (user_id, username, credits) VALUES ($1, $2, $3)`,
        [userId, username, MAX_CREDITS]
      );
    } else {
      await client.query(
        `UPDATE user_credits SET username = $2 WHERE user_id = $1`,
        [userId, username]
      );
    }

    client.release();
    await ctx.reply("🤖 Hello! Ask me anything. You have 5 free creates.");
  } catch (error) {
    console.error("DB Error:", error);
    await ctx.reply("⚠️ Something went wrong. Please try again later.");
  }
});

bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.message.from.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT credits FROM user_credits WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      await client.query(
        `INSERT INTO user_credits (user_id, username, credits) VALUES ($1, $2, $3)`,
        [userId, ctx.message.from.username || "unknown", MAX_CREDITS]
      );
    } else {
      const userCredits = result.rows[0].credits;
      if (userCredits <= 0) {
        await ctx.reply(
          `⚠️ You've used all ${MAX_CREDITS} free requests. \nMessage @wei_b0 to get more creates.`
        );
        return;
      }
      await client.query(
        `UPDATE user_credits SET credits = credits - 1 WHERE user_id = $1`,
        [userId]
      );
    }

    client.release();

    const loadingMessage = await ctx.reply("🤖 Thinking...");
    await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

    const response = await axios.post(
      `${API_URL}/chat`,
      { query: userMessage },
      { headers: { "x-api-key": API_KEY } }
    );

    const aiReply = response.data.answer || "⚠️ AI is currently unavailable.";
    const chunks = splitMessageIntoChunks(aiReply, 4000);

    await ctx.telegram.deleteMessage(ctx.chat.id, loadingMessage.message_id);

    for (const chunk of chunks) {
      await ctx.reply(chunk, { parse_mode: "HTML" });
    }
  } catch (error) {
    console.error("Error:", error);
    await ctx.reply("⚠️ AI service is currently down. Please try again later.");
  }
});

bot.catch((err) => console.error("Bot Error:", err));

bot.launch().then(() => console.log("🤖 Bot is running..."));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
