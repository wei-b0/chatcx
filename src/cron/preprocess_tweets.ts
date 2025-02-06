import { Client } from "pg";
import { Tweet } from "agent-twitter-client";
import { createDocument } from "../llm/embed";

export async function preprocess(tweets: Tweet[]) {
  const client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  await client.connect();

  for (const tweet of tweets) {
    try {
      const doc = await createDocument(tweet);
      const embeddingVector = JSON.stringify(doc.embedding);

      await client.query(
        `
        INSERT INTO tweet_embeddings (
          id, text, embedding, timestamp, is_reply, is_retweet, is_quoted, 
          username, likes, retweets, replies, views, bookmark_count, keywords, sentiment
        ) VALUES (
          $1, $2, $3, to_timestamp($4), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (id) DO UPDATE SET
          text = EXCLUDED.text,
          embedding = EXCLUDED.embedding,
          timestamp = EXCLUDED.timestamp,
          is_reply = EXCLUDED.is_reply,
          is_retweet = EXCLUDED.is_retweet,
          is_quoted = EXCLUDED.is_quoted,
          username = EXCLUDED.username,
          likes = EXCLUDED.likes,
          retweets = EXCLUDED.retweets,
          replies = EXCLUDED.replies,
          views = EXCLUDED.views,
          bookmark_count = EXCLUDED.bookmark_count,
          keywords = EXCLUDED.keywords,
          sentiment = EXCLUDED.sentiment;
        `,
        [
          doc.id,
          doc.text,
          embeddingVector,
          doc.metadata.timestamp,
          doc.metadata.is_reply,
          doc.metadata.is_retweet,
          doc.metadata.is_quoted,
          doc.metadata.username,
          doc.metadata.engagement.likes,
          doc.metadata.engagement.retweets,
          doc.metadata.engagement.replies,
          doc.metadata.engagement.views,
          doc.metadata.engagement.bookmark_count,
          doc.metadata.keywords,
          doc.metadata.sentiment,
        ]
      );

      console.log(`Tweet ${doc.id} processed successfully.`);
    } catch (error) {
      console.error(`Error processing tweet ${tweet.id}:`, error);
    }
  }

  await client.end();
}
