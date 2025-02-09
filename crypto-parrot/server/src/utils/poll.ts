import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const POLL_INTERVAL = 5000;
const MAX_RETRIES = 60;

export async function pollForJobCompletion(chatId: string): Promise<any> {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const statusResponse = await axios.get(
        `${process.env.API_URL}/${chatId}`,
        {
          headers: { "x-api-key": process.env.API_KEY },
        }
      );

      if (statusResponse.data.status === "completed") {
        return statusResponse.data.result;
      }

      if (statusResponse.data.status === "failed") {
        throw new Error("Job processing failed.");
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      attempts++;
    } catch (error) {
      console.error("Error polling job status:", error);
      return null;
    }
  }

  return null;
}
