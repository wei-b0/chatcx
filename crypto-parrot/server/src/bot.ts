import { Telegraf, Context, Middleware } from "telegraf";
import dotenv from "dotenv";
import { checkRateLimit, getUserByTelegramId } from "./db";
import { splitMessageIntoChunks } from "./utils/format";
import { trackEvent } from "./utils/posthog";
import axios from "axios";
import { pollForJobCompletion } from "./utils/poll";
import { preventMultipleRequests } from "./utils/middleware";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL;
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

if (!BOT_TOKEN || !MINI_APP_URL || !API_KEY || !API_URL) {
  throw new Error("Incorrect .env");
}

const bot = new Telegraf(BOT_TOKEN);

bot.use(preventMultipleRequests());

bot.telegram.setMyCommands([
  { command: "/start", description: "Start the bot" },
  { command: "/help", description: "Get help information" },
  { command: "/about", description: "Learn about this bot" },
  { command: "/settings", description: "Adjust your preferences" },
]);

bot.start(async (ctx: Context) => {
  const username = ctx.from?.username || ctx.from?.first_name || "User";
  const tgId = ctx.from?.id;
  const user = await getUserByTelegramId(Number(tgId));
  trackEvent((tgId as any).toString(), "start_clicked");
  if (user) {
    trackEvent((tgId as any).toString(), "register_user_clicked", { username });
    const welcomeMessage = `🦜 Welcome back, ${username}!\n\nWhat’s squawking in Web3 today?`;
    ctx.reply(welcomeMessage, {
      reply_markup: {
        keyboard: [
          [{ text: "🦜 Parrot Feed" }],
          [{ text: "🪙 Trending Now" }],
          [{ text: "🎯 Top Influencers" }, { text: "📚 Help Center" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  } else {
    trackEvent((tgId as any).toString(), "non_registered_user_clicked", {
      username,
    });
    const welcomeMessage = `🦜 Squawk ${username}!\n\n<b>Welcome to Crypto Parrot</b>—your <b>AI</b>-powered sidekick for <b>Real-Time Web3 Twitter insights and trends</b>.\n\nStay ahead of the metas and never miss what’s buzzing in the web3 world!`;

    ctx.reply(welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Let's get you set up!",
              web_app: {
                url: MINI_APP_URL,
              },
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  }
});

bot.help((ctx) => {
  const tgId = ctx.from.id;
  const username = ctx.from.username;
  trackEvent((tgId as any).toString(), "help_clicked_registration", {
    username,
  });
  ctx.reply(
    `<b>What Crypto Parrot Does</b>\n- <b>Parrot Feed</b>: A personalized summary of the latest and upcoming metas on Web3 Twitter, intelligently curated by our AI.\n- <b>Trending Now</b>: Real-time highlights of the most engaging tweets and trends, identified and ranked using AI-powered insights.\n- <b>Top Influencers</b>: A leaderboard showcasing the most active and impactful voices in Web3.\n\n<i>All updates are delivered in real-time, straight from the sharpest minds and most influential players in Web3—with a little help from AI magic. Squawk on!</i>`,
    { parse_mode: "HTML" }
  );
});

bot.command("about", (ctx) => {
  const tgId = ctx.from.id;
  const username = ctx.from.username;
  trackEvent((tgId as any).toString(), "about_clicked_registration", {
    username,
  });
  ctx.reply(
    "🦜 About Crypto Parrot\n\nWelcome to <i>Crypto Parrot</i>—the AI-powered Telegram bot for Web3 enthusiasts, fellow marketeers, or curious minds who want to stay informed about the latest and upcoming trends (or metas) shaping the web3 space, real-time from Web3 Twitter. Whether you’re exploring influencer insights or just keeping up with what’s buzzing, Crypto Parrot delivers it all in real-time.\n\n<i>What Makes Crypto Parrot Unique</i>  \n- <b>Hourly Refreshes</b>: Get the freshest updates and never miss a beat.  \n- <b>AI-Driven Insights</b>: We cut through the noise and deliver the signal.  \n- <b>Web3 Culture Savvy</b>: From memes to moonshots, we cover it all—zesty, snappy, and fun.\n\nCrypto Parrot keeps you informed, engaged, and in the know. <i>Squawk on and stay ahead!</i>",
    { parse_mode: "HTML" }
  );
});

bot.command("settings", (ctx) => {
  const tgId = ctx.from.id;
  trackEvent((tgId as any).toString(), "settings_clicked_registration");
  ctx.reply("Settings menu coming soon!");
});

bot.hears("🦜 Parrot Feed", async (ctx) => {
  const username = ctx.from.username;
  const tgId = ctx.from?.id;
  ctx.reply("🦜 Fetching your Parrot Feed with the latest web3 insights...");
  const user = await getUserByTelegramId(Number(tgId));
  if (!user) {
    trackEvent(tgId.toString(), "parrot_feed_clicked_non_user", { username });
    const welcomeMessage = `🦜 Squawk ${username},\nWelcome to Crypto Parrot!\n\nIt seems you’re trying to access this feature, but you’re not signed in yet. Sign in now to access this feature!`;
    return ctx.reply(welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Let's get you set up!",
              web_app: {
                url: MINI_APP_URL,
              },
            },
          ],
        ],
      },
    });
  }

  trackEvent(tgId.toString(), "parrot_feed_clicked", { username });

  const allowed = await checkRateLimit(tgId, "Parrot Feed");

  if (!allowed) {
    return ctx.reply(
      "🚨 Squawk! You’ve reached your free limit for the Parrot Feed today. Come back tomorrow for more insights, or get in touch with us at @wei_b0!"
    );
  }

  try {
    const response = await axios.post(
      API_URL,
      { query: "Fetch me the latest web3 and crypto insights." },
      { headers: { "x-api-key": API_KEY } }
    );

    if (!response.data.chatId) throw new Error("Failed to retrieve Job ID");

    const chatId = response.data.chatId;

    const result = await pollForJobCompletion(chatId);

    if (result) {
      const answer = splitMessageIntoChunks(result.answer, 4000);
      for (const chunk of answer) {
        ctx.reply(chunk, { parse_mode: "HTML" });
      }
    } else {
      ctx.reply("❌ Sorry, the request took too long. Please try again later.");
    }
  } catch (error) {
    console.error("Error generating Parrot Feed report:", error);
    ctx.reply(
      "❌ An error occurred while generating your Parrot Feed. Please try again later."
    );
  }
});

/**
 * Implementation for Trending Now reply
 */

bot.hears("🪙 Trending Now", async (ctx) => {
  const username = ctx.from.username;
  const tgId = ctx.from?.id;
  const userId = ctx.message.from.id;

  ctx.reply("🪙 Fetching the hottest trends in web3 right now...");
  const user = await getUserByTelegramId(Number(tgId));
  if (!user) {
    trackEvent(tgId.toString(), "trending_now_clicked_non_user", { username });
    const welcomeMessage = `🦜 Squawk ${username},\nWelcome to Crypto Parrot!\n\nIt seems you’re trying to access this feature, but you’re not signed in yet. Sign in now to access this feature!`;

    return ctx.reply(welcomeMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Let's get you set up!",
              web_app: {
                url: MINI_APP_URL,
              },
            },
          ],
        ],
      },
    });
  }

  trackEvent(tgId.toString(), "parrot_feed_clicked", { username });

  const allowed = await checkRateLimit(tgId, "Trending Now");

  if (!allowed) {
    return ctx.reply(
      "🚨 Squawk! You’ve reached your free limit for the Trending Now today. Come back tomorrow for more insights, or get in touch with @wei_b0!"
    );
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        query:
          "Fetch me some of the hottest trends in web3 and crypto right now.",
      },
      { headers: { "x-api-key": API_KEY } }
    );

    if (!response.data.chatId) throw new Error("Failed to retrieve Job ID");

    const chatId = response.data.chatId;

    const result = await pollForJobCompletion(chatId);

    if (result) {
      const answer = splitMessageIntoChunks(result.answer, 4000);
      for (const chunk of answer) {
        ctx.reply(chunk, { parse_mode: "HTML" });
      }
    } else {
      ctx.reply("❌ Sorry, the request took too long. Please try again later.");
    }
  } catch (error) {
    console.error("Error generating Trending Now report:", error);
    ctx.reply(
      "❌ An error occurred while generating the Trending Now report. Please try again later."
    );
  }
});

bot.hears("🎯 Top KOLs", (ctx) => {
  const tgId = ctx.from.id;
  const username = ctx.from.username;
  trackEvent(tgId.toString(), "top_influencers_clicked", { username });
  ctx.reply("🎯 These are today’s top KOLs (coming soon)!");
});

bot.hears("📚 Help Center", (ctx) => {
  const tgId = ctx.from.id;
  const username = ctx.from.username;
  trackEvent(tgId.toString(), "help_center_clicked", { username });
  ctx.reply(
    `<b>What Crypto Parrot Does</b>\n- <b>Parrot Feed</b>: A personalized summary of the latest and upcoming metas on Web3 Twitter, intelligently curated by our AI.\n\n- <b>Trending Now</b>: Real-time highlights of the most engaging tweets and trends, identified and ranked using AI-powered insights.\n\n- <b>Top Influencers</b>: A leaderboard showcasing the most active and impactful voices in Web3.\n\n<i>All updates are delivered in real-time, straight from the sharpest minds and most influential players in web3—with a little help from AI magic. Squawk on!</i>`,
    { parse_mode: "HTML" }
  );
});

bot.action("help_yes", async (ctx) => {
  await ctx.editMessageReplyMarkup({ reply_markup: undefined } as any);
  ctx.reply(
    `<b>What Crypto Parrot Does</b>\n\n- <b>Parrot Feed</b>: A personalized summary of the latest and upcoming metas on Web3 Twitter, intelligently curated by our AI.\n\n- <b>Trending Now</b>: Real-time highlights of the most engaging tweets and trends, identified and ranked using AI-powered insights.\n\n- <b>Top Influencers</b>: A leaderboard showcasing the most active and impactful voices in Web3.\n\n<i>All updates are delivered in real-time, straight from the sharpest minds and most influential players in web3—with a little help from AI magic. Squawk on!</i>`,
    { parse_mode: "HTML" }
  );

  await ctx.answerCbQuery();
});

bot.action("help_no", async (ctx) => {
  await ctx.editMessageReplyMarkup({ reply_markup: undefined } as any);
  await ctx.answerCbQuery();
});

export const startBot = async () => {
  bot
    .launch()
    .then(() => {
      console.log("Telegram bot started successfully.");
    })
    .catch((err) => {
      console.error("Failed to launch Telegram bot:", err);
      process.exit(1);
    });

  process.once("SIGINT", () => {
    console.log("SIGINT received. Shutting down bot...");
    bot.stop("SIGINT");
    process.exit(0);
  });
  process.once("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down bot...");
    bot.stop("SIGTERM");
    process.exit(0);
  });
};

export { bot };
