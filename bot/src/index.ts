import { Markup, Telegraf } from "telegraf";
import { BOT_TOKEN, MAX_CREDITS } from "./config/env";
import {
  getUserCredits,
  initializeUser,
  decrementUserCredits,
} from "./services/userService";
import { fetchCryptoriaResponse } from "./services/cryptoriaService";
import { splitMessageIntoChunks } from "./utils/format";
import { pollForJobCompletion } from "./utils/poll";

const bot = new Telegraf(BOT_TOKEN);
const isProcessing = new Map();

bot.use(async (ctx, next) => {
  const userId = ctx.message?.from.id;
  if (!userId) return next();

  if (isProcessing.get(userId)) {
    await ctx.replyWithMarkdown(
      `⏳ *I'm still processing your last request...*\n\nPlease wait for a response before asking again!`
    );
    return;
  }

  isProcessing.set(userId, true);
  await next();
  isProcessing.delete(userId);
});

bot.start(async (ctx) => {
  const userId = ctx.message.from.id;
  const username = ctx.message.from.username || "unknown";

  await initializeUser(userId, username);
  await ctx.replyWithMarkdown(
    `🚀 *Welcome to ChatCX – Your AI Edge for Web3 Twitter!* 

    🔎 Get instant insights on trending narratives, market shifts, and game-changing alpha.

    🎁 *You have 5 free queries* to explore the hottest web3 insights!

    👉 *Try asking:* 
    - \`What’s the latest narrative on Base?\`
    - \`What emerging trends are being discussed in crypto right now?\`
    - \`What’s the hottest token of the week?\`
    - \`Are there any new DeFi projects gaining attention?\`
    
    ⚠️ *Please be patient!* AI processing can take a few minutes. Avoid sending multiple queries at once.`
  );
});

bot.on("text", async (ctx) => {
  const userId = ctx.message.from.id;

  const userMessage = ctx.message.text;

  const loadingMessage = await ctx.replyWithMarkdown(
    `🤖 *Thinking...*\n\nThis may take a few minutes. Please wait patiently and avoid sending multiple requests.`
  );

  const userCredits = await getUserCredits(userId);
  if (userCredits === null) {
    await initializeUser(userId, ctx.message.from.username || "unknown");
  } else if (userCredits <= 0) {
    await ctx.replyWithMarkdown(
      `⚠️ *You've used all ${MAX_CREDITS} free requests!* 🚀`,
      Markup.inlineKeyboard([
        Markup.button.url("📩 Message for Credits", "https://t.me/wei_b0"),
      ])
    );
    return;
  }

  await decrementUserCredits(userId);

  try {
    const chatId = await fetchCryptoriaResponse(userMessage);

    await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

    const result = await pollForJobCompletion(chatId);

    await ctx.telegram.deleteMessage(ctx.chat.id, loadingMessage.message_id);

    if (result) {
      const answer = splitMessageIntoChunks(result.answer, 4000);
      for (const chunk of answer) {
        await ctx.reply(chunk, { parse_mode: "HTML" });
      }
    } else {
      await ctx.reply(
        "❌ Sorry, the request took too long. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    await ctx.reply("⚠️ Oops! Something went wrong. Try again later.");
  }
});

bot.catch((err) => console.error("Bot Error:", err));

bot.launch().then(() => console.log("🤖 Bot is running..."));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
