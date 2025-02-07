import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN!;
const API_URL = process.env.API_URL!;

if (!BOT_TOKEN || !API_URL) {
  console.error("Missing BOT_TOKEN or AI_API_URL in environment variables.");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply("🤖 Hello! Ask me anything."));

bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;

  try {
    await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

    const loadingMessage = await ctx.reply("🤖 Thinking...");

    const response = await axios.post(`${API_URL}/chat`, {
      query: userMessage,
    });

    const aiReply = response.data.answer || "⚠️ AI is currently unavailable.";

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      loadingMessage.message_id,
      undefined,
      aiReply
    );
  } catch (error) {
    console.error("Error:", error);
    await ctx.reply("⚠️ AI service is currently down. Please try again later.");
  }
});

bot.catch((err) => {
  console.error("Bot Error:", err);
});

bot.launch().then(() => console.log("🤖 Bot is running..."));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
