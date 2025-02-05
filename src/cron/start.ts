import { getTopYappers } from "../TwitterPipeline/TopYappers";
import TwitterPipeline from "../TwitterPipeline/TwitterPipeline";
import * as dotenv from "dotenv";
import { preprocess } from "./preprocess_tweets";

dotenv.config();

export const start = async () => {
  const twitter = new TwitterPipeline();
  const topYappers = await getTopYappers();
  const tweets = await twitter.run(topYappers);

  console.log(
    `Fetched ${tweets.length} tweets. Pre-processing them and storing...`
  );

  await preprocess(tweets);

  console.log("All tweets processed.");
};
