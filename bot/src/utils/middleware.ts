import { Context, Middleware } from "telegraf";

const userStates = new Map<
  number,
  {
    processing: boolean;
    lastRequest: number;
  }
>();
const COOLDOWN_PERIOD = 180 * 1000;

export const preventMultipleRequests =
  (): Middleware<Context> => async (ctx, next) => {
    const userId = ctx.message?.from?.id || ctx.callbackQuery?.from?.id;

    if (!userId) {
      console.warn("No user ID found in context");
      return next();
    }

    let userState = userStates.get(userId);
    if (!userState) {
      userState = { processing: false, lastRequest: 0 };
      userStates.set(userId, userState);
    }

    const now = Date.now();
    const timeSinceLastRequest = now - userState.lastRequest;

    if (timeSinceLastRequest < COOLDOWN_PERIOD) {
      const remainingTime = Math.ceil(
        (COOLDOWN_PERIOD - timeSinceLastRequest) / 1000
      );
      console.log(
        `[DEBUG] User ${userId} is in cooldown period. ${remainingTime}s remaining`
      );

      const cooldownMessage = `⏳ Please wait ${remainingTime} seconds before making another request.`;

      if (ctx.callbackQuery) {
        await ctx.answerCbQuery(cooldownMessage);
      } else {
        await ctx.reply(cooldownMessage, { parse_mode: "Markdown" });
      }
      return;
    }

    if (userState.processing) {
      console.log(
        `[DEBUG] Rejecting request from user ${userId} - already processing`
      );

      if (ctx.callbackQuery) {
        await ctx.answerCbQuery(
          "Still processing your last request. Please wait..."
        );
      } else {
        await ctx.reply(
          "⏳ Still processing your last request. Please wait...",
          {
            parse_mode: "Markdown",
          }
        );
      }
      return;
    }

    userState.processing = true;
    userState.lastRequest = now;

    try {
      await next();
    } catch (error) {
      console.error(
        `[ERROR] Error processing request for user ${userId}:`,
        error
      );
      await ctx.reply(
        "❌ An error occurred while processing your request. Please try again."
      );
    } finally {
      const state = userStates.get(userId);
      if (state) {
        state.processing = false;
      }
    }
  };
