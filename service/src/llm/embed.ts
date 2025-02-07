import { Tweet } from "agent-twitter-client";
import axios from "axios";
import Sentiment from "sentiment";
import keywordExtractor from "keyword-extractor";
import { Document } from "../types";
import { OPENAI_API_KEY } from "../config/env";

export function extractKeywords(text: string): string[] {
  const extractionResult = keywordExtractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });
  return extractionResult;
}

export async function createDocument(tweet: Tweet): Promise<Document> {
  const embedding = await createEmbedding(tweet);
  return {
    id: tweet.id,
    text: tweet.text,
    embedding: embedding.embedding,
    metadata: {
      timestamp: tweet.timestamp,
      is_reply: tweet.isReply,
      is_retweet: tweet.isRetweet,
      is_quoted: tweet.isQuoted,
      username: tweet.username,
      engagement: {
        likes: tweet.likes,
        retweets: tweet.retweets,
        replies: tweet.replies,
        views: tweet.views,
        bookmark_count: tweet.bookmarkCount,
      },
      keywords: embedding.metadata.keywords,
      sentiment: embedding.metadata.sentiment,
    },
  };
}

export async function createEmbedding(tweet: Tweet): Promise<{
  embedding: number[];
  metadata: { sentiment: string; keywords: string[] };
}> {
  const sentiment = new Sentiment();
  let sentimentText = "";
  if (tweet.text) {
    const result = sentiment.analyze(tweet.text);
    if (result.score > 0) {
      sentimentText = "positive sentiment";
    } else if (result.score < 0) {
      sentimentText = "negative sentiment";
    } else {
      sentimentText = "neutral sentiment";
    }
  }

  const parts: string[] = [];
  let keywords;

  if (tweet.username) {
    parts.push(`Tweet by @${tweet.username}:`);
  }

  if (tweet.text) {
    parts.push(`${tweet.text}`);
    keywords = extractKeywords(tweet.text);
    if (keywords.length) {
      parts.push(`Keywords: ${keywords.join(", ")};`);
    }
  }

  if (sentimentText) {
    parts.push(`Sentiment: ${sentimentText};`);
  }

  let engagementDesc = "";
  if (tweet.likes !== undefined) {
    if (tweet.likes > 100) {
      engagementDesc += "highly liked, ";
    } else {
      engagementDesc += `${tweet.likes} likes, `;
    }
  }
  if (tweet.retweets !== undefined) {
    if (tweet.retweets > 50) {
      engagementDesc += "trending due to retweets, ";
    } else {
      engagementDesc += `${tweet.retweets} retweets, `;
    }
  }
  if (tweet.replies !== undefined) {
    if (tweet.replies > 20) {
      engagementDesc += "sparking lively discussion, ";
    } else {
      engagementDesc += `${tweet.replies} replies, `;
    }
  }
  if (engagementDesc) {
    engagementDesc = engagementDesc.replace(/,\s*$/, "");
    parts.push(`Engagement: ${engagementDesc}.`);
  }

  if (tweet.isReply) parts.push(`(This is a reply.)`);
  if (tweet.isRetweet) parts.push(`(This is a retweet.)`);

  const string = parts.join(" ");

  const embedding = await getEmbedding(string);
  return {
    embedding,
    metadata: { sentiment: sentimentText, keywords: keywords ? keywords : [] },
  };
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: text,
        model: "text-embedding-ada-002",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error: any) {
    throw new Error(
      `OpenAI API error: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
}
