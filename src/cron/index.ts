import cron from "node-cron";
import { start } from "./start";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10000;

const runCronJob = async () => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      console.log(
        `[${new Date().toISOString()}] Cron job started. Attempt ${
          attempts + 1
        }`
      );
      await start();
      console.log(
        `[${new Date().toISOString()}] Cron job completed successfully.`
      );
      return;
    } catch (error) {
      attempts++;
      console.error(
        `[${new Date().toISOString()}] Error in cron job (Attempt ${attempts}):`,
        error
      );

      if (attempts < MAX_RETRIES) {
        const waitTime = RETRY_DELAY_MS * Math.pow(2, attempts - 1);
        console.log(
          `[${new Date().toISOString()}] Retrying in ${
            waitTime / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        console.error(
          `[${new Date().toISOString()}] Cron job failed after ${MAX_RETRIES} attempts.`
        );
      }
    }
  }
};

cron.schedule("0 */6 * * *", () => {
  runCronJob();
});

console.log("Cron job scheduled to run every 6 hours.");
