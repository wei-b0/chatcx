import { Telegraf } from "telegraf";
import { BOT_TOKEN, MAX_CREDITS } from "./config/env";
import {
  getUserCredits,
  initializeUser,
  decrementUserCredits,
} from "./services/userService";
import { fetchCryptoriaResponse } from "./services/cryptoriaService";
import { splitMessageIntoChunks } from "./utils/format";

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  const userId = ctx.message.from.id;
  const username = ctx.message.from.username || "unknown";

  await initializeUser(userId, username);
  await ctx.reply("🤖 Hello! Ask me anything. You have 5 free creates.");
});

bot.on("text", async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.message.from.id;
  const loadingMessage = await ctx.reply("🤖 Thinking...");

  const userCredits = await getUserCredits(userId);
  if (userCredits === null) {
    await initializeUser(userId, ctx.message.from.username || "unknown");
  } else if (userCredits <= 0) {
    await ctx.reply(
      `⚠️ You've used all ${MAX_CREDITS} free requests. \nMessage @wei_b0 to get more creates.`
    );
    return;
  }

  await decrementUserCredits(userId);
  await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

  const aiReply = await fetchCryptoriaResponse(userMessage);
  const chunks = splitMessageIntoChunks(aiReply, 4000);

  await ctx.telegram.deleteMessage(ctx.chat.id, loadingMessage.message_id);

  for (const chunk of chunks) {
    await ctx.reply(chunk, { parse_mode: "HTML" });
  }
});

bot.catch((err) => console.error("Bot Error:", err));

bot.launch().then(() => console.log("🤖 Bot is running..."));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
