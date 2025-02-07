import cron from "node-cron";
import { start } from "./start";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 10000;
let lastUpdated: string | null = null;

export const runCronJob = (updateTimestamp: (timestamp: string) => void) => {
  cron.schedule("0 */6 * * *", async () => {
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        console.log(
          `[${new Date().toISOString()}] Cron job started. Attempt ${
            attempts + 1
          }`
        );
        await start();
        lastUpdated = new Date().toISOString();
        updateTimestamp(lastUpdated);
        console.log(`[${lastUpdated}] Cron job completed successfully.`);
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
  });

  console.log("Cron job scheduled to run every 6 hours.");
};
