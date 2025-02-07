import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import { splitMessageIntoChunks } from "./utils/format";

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
    const loadingMessage = await ctx.reply("🤖 Thinking...");
    await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

    const response = await axios.post(
      `${API_URL}/chat`,
      {
        query: userMessage,
      },
      { timeout: 300000 }
    );

    const aiReply = response.data.answer || "⚠️ AI is currently unavailable.";

    const chunks = splitMessageIntoChunks(aiReply, 4000);

    await ctx.telegram.deleteMessage(ctx.chat.id, loadingMessage.message_id);

    for (const chunk of chunks) {
      await ctx.reply(chunk, {
        parse_mode: "HTML",
      });
    }
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
