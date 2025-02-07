import { Scraper, SearchMode } from "agent-twitter-client";
import { Tweet } from "agent-twitter-client";
import fs from "fs/promises";
import path from "path";

class TwitterPipeline {
  private scraper: Scraper;
  private cookiesPath: string;

  constructor() {
    this.scraper = new Scraper();
    this.cookiesPath = path.join(
      process.env.COOKIE_STORAGE_PATH || "/app/data",
      "twitter_cookies.json"
    );
  }

  private async saveCookies(): Promise<void> {
    try {
      const cookies = await this.scraper.getCookies();
      await fs.writeFile(this.cookiesPath, JSON.stringify(cookies, null, 2));
      console.log("🔒 Cookies saved successfully.");
    } catch (error: any) {
      console.error("⚠️ Failed to save cookies:", error.message);
    }
  }

  private async loadCookies(): Promise<boolean> {
    console.log("Looking for cookies at:", this.cookiesPath);

    try {
      const data = await fs.readFile(this.cookiesPath, "utf-8");
      const cookiesArray = JSON.parse(data);

      const cookieStrings = cookiesArray.map((cookie: any) => {
        return `${cookie.key}=${cookie.value}; Domain=${cookie.domain}; Path=${
          cookie.path
        }; ${cookie.secure ? "Secure" : ""}; ${
          cookie.httpOnly ? "HttpOnly" : ""
        }; SameSite=${cookie.sameSite || "Lax"}`;
      });

      await this.scraper.setCookies(cookieStrings);
      console.log("🔑 Cookies loaded successfully.");
      return true;
    } catch (error: any) {
      console.error("⚠️ Failed to load cookies:", error.message);
      return false;
    }
  }

  private async initializeScraper(): Promise<void> {
    const cookiesLoaded = await this.loadCookies();
    if (cookiesLoaded) {
      try {
        if (await this.scraper.isLoggedIn()) {
          console.log("✅ Successfully authenticated using saved cookies.");
          return;
        } else {
          console.warn(
            "⚠️ Cookies loaded but session is not valid. Attempting fresh login."
          );
        }
      } catch (error: any) {
        console.warn(
          "⚠️ Error validating cookies. Attempting fresh login.",
          error.message
        );
      }
    } else {
      console.log("🔑 No cookies found. Proceeding with fresh login.");
    }

    const username = process.env.TWITTER_USERNAME;
    const password = process.env.TWITTER_PASSWORD;
    const email = process.env.TWITTER_EMAIL;

    if (!username || !password) {
      throw new Error("Twitter credentials not found");
    }

    try {
      await this.scraper.login(username, password, email);
      if (!(await this.scraper.isLoggedIn())) {
        throw new Error("Authentication failed");
      }
      console.log("✅ Successfully authenticated with Twitter.");
      await this.saveCookies();
    } catch (error: any) {
      throw new Error(`Failed to initialize scraper: ${error.message}`);
    }
  }

  private async collectTweets(
    username: string,
    maxTweets?: number
  ): Promise<Tweet[]> {
    const tweets: Tweet[] = [];
    let attempts = 0;

    try {
      const searchResults = this.scraper.searchTweets(
        `from:${username}`,
        maxTweets !== undefined ? maxTweets : 25,
        SearchMode.Latest
      );

      for await (const tweet of searchResults) {
        attempts++;

        if (!tweet) {
          console.log(
            `Skipping null or undefined tweet at attempt ${attempts}.`
          );
          continue;
        }

        if (tweet && !tweet.isReply) {
          tweets.push(tweet);
        }
      }
      return tweets;
    } catch (error: any) {
      console.error(`Error while collecting tweets for @${username}:`, error);
      throw new Error(
        `Failed to collect tweets for @${username}: ${error.message}`
      );
    }
  }

  private extractTweetIdFromUrl(url: string): string {
    const match = url.match(/status\/(\d+)/);
    if (!match || !match[1]) {
      throw new Error("Invalid tweet URL format.");
    }
    return match[1];
  }

  public async getTweetContent(tweetUrl: string): Promise<Tweet> {
    await this.initializeScraper();

    try {
      const tweetId = this.extractTweetIdFromUrl(tweetUrl);
      const tweet = await this.scraper.getTweet(tweetId);

      if (!tweet) {
        throw new Error("Tweet not found.");
      }

      return {
        id: tweet.id,
        text: tweet.text,
        timestamp: tweet.timestamp,
        username: tweet.username,
      } as any;
    } catch (error: any) {
      console.error("Error fetching tweet content:", error.message);
      throw new Error(`Failed to fetch tweet content: ${error.message}`);
    }
  }

  async run(usernames: string[], maxTweets?: number): Promise<Tweet[]> {
    await this.initializeScraper();

    const results: Tweet[] = [];

    for (const username of usernames) {
      try {
        const tweets = await this.collectTweets(username, maxTweets);
        results.push(...tweets);
        console.log(`Collected ${tweets.length} tweets for @${username}`);
      } catch (error: any) {
        console.error(
          `Failed to collect tweets for @${username}: ${error.message}`
        );
      }
    }

    return results;
  }
}

export default TwitterPipeline;
