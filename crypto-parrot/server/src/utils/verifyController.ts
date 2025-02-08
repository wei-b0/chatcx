import { createHmac } from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

export const verifyInitData = async (
  initData: string
): Promise<{ success: boolean; initData: string }> => {
  try {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!clientId || !clientSecret || !BOT_TOKEN) {
      return { success: false, initData: "No ENVs" };
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get("hash");

    urlParams.delete("hash");
    urlParams.sort();
    let dataCheckString = "";
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN);
    const calculatedHash = createHmac("sha256", secret.digest())
      .update(dataCheckString)
      .digest("hex");

    if (hash !== calculatedHash) {
      return {
        success: false,
        initData: "Invalid InitData",
      };
    }

    urlParams.append("client_id", clientId);
    urlParams.sort();

    dataCheckString = "";
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const centralSecret = createHmac("sha256", "WebAppData").update(
      clientSecret
    );
    const centralHash = createHmac("sha256", centralSecret.digest())
      .update(dataCheckString)
      .digest("hex");
    urlParams.append("hash", centralHash);

    return {
      success: true,
      initData: urlParams.toString(),
    };
  } catch (error) {
    console.error(error);
    return { success: false, initData: "errored" };
  }
};
