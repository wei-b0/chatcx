import express from "express";
import dotenv from "dotenv";
import { startBot, bot } from "./bot";
import cors from "cors";
import { verifyInitData } from "./utils/verifyController";
import axios from "axios";
import { getUserByTelegramId, upsertUser } from "./db";
import { trackEvent } from "./utils/posthog";

startBot();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.options("*", cors(corsOptions));

app.get("/user/:tg_user_id", async (req: any, res: any) => {
  const tgUserId = parseInt(req.params.tg_user_id, 10);

  if (isNaN(tgUserId)) {
    return res.status(400).json({ error: "Invalid Telegram User ID" });
  }

  try {
    const user = await getUserByTelegramId(tgUserId);

    if (user) {
      return res.status(200).json({ exists: true, user });
    } else {
      return res.status(200).json({ exists: false, user: "Not Found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/register", async (req: any, res: any) => {
  const { initRawData, userId } = req.body;

  trackEvent(userId, "register_attempt");

  console.log("Received /register request:");

  if (!initRawData || !userId) {
    console.warn("Missing initRawData or userId in request.");
    return res
      .status(400)
      .json({ error: "initRawData and userId are required" });
  }

  const auth = await verifyInitData(initRawData);
  const response = await axios.post(
    `${process.env.CAPX_AUTH}/v3/users/auth`,
    {},
    {
      headers: {
        "x-initdata": auth.initData,
      },
    }
  );

  if (response.data.result.success) {
    const user = response.data.result.user;

    await upsertUser({
      tg_user_id: user.tg_user_id,
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      tg_username: user.tg_username,
      wallet_address: user.wallet_address,
      photo_url: user.photo_url,
      referral_code: user.referral_code,
      registered_on: user.registered_on,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      rate_limit: {},
    });

    console.log("User successfully saved to the database.");

    trackEvent(userId, "new_user_register_success", {
      username: user.tg_username,
      plan: "free",
    });

    // if (response.data.signup_tx) {
    //   try {
    //     await axios.post(
    //       `${process.env.CAPX_AUTH}/v3/wallet/faucet`,
    //       {},
    //       {
    //         headers: {
    //           Authorization: `Bearer ${response.data.access_token}`,
    //         },
    //       }
    //     );
    //     // TODO: Mint XID

    //   } catch (e) {
    //     console.log(`Capx Faucet Failed`, e);
    //   }
    // }

    try {
      const replyMessage = `🦜 Squawk! You’re all set!`;
      await bot.telegram.sendMessage(userId, replyMessage, {
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

      await bot.telegram.sendMessage(
        userId,
        "Want to know how to make the most of Crypto Parrot’s features? Let’s get squawking!",
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Yes", callback_data: "help_yes" },
                { text: "No", callback_data: "help_no" },
              ],
            ],
          },
        }
      );

      res.status(200).json({ status: "success" });
    } catch (error: any) {
      console.error("Error sending message via bot:");

      trackEvent(userId, "register_failed", {
        error_message: error.toString(),
      });

      if (error.response && error.response.status === 403) {
        res.status(403).json({
          error:
            "Bot cannot message the user. Ensure the user has started the bot.",
        });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } else {
    console.log("Capx Failed", response.data);
    res.status(500).json({ error: "Capx Internal Server Error" });
  }
});

app.get("/health", (req: any, res: any) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
