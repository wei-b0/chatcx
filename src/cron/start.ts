import { getTopAccounts } from "../TwitterPipeline/utils";
import TwitterPipeline from "../TwitterPipeline/TwitterPipeline";
import * as dotenv from "dotenv";
import { preprocess } from "./preprocess_tweets";

dotenv.config();

export const start = async () => {
  const twitter = new TwitterPipeline();
  const topAccounts = await getTopAccounts();
  const tweets = await twitter.run(topAccounts);

  console.log(
    `Fetched ${tweets.length} tweets. Pre-processing them and storing...`
  );

  await preprocess(tweets);

  console.log("All tweets processed.");
};
