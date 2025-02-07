import axios from "axios";
import { getEmbedding } from "./embed";
import { ReplyGenerator, UserPrompt } from "./prompts";
import { Client } from "pg";

export async function answerQuery(userQuery: string): Promise<string> {
  const queryEmbedding = await getEmbedding(userQuery);

  const sql = `
    WITH ranked_tweets AS (
      SELECT 
        text, username, likes, retweets, replies, views, keywords, sentiment,
        (embedding <-> $1::vector) AS distance,
        ts_rank_cd(to_tsvector('english', text), plainto_tsquery($2)) AS bm25_score
      FROM tweet_embeddings
      WHERE (embedding <-> $1::vector) < 1.0 -- Exclude poor matches
      ORDER BY bm25_score DESC, distance ASC
      LIMIT 50 -- Retrieve more tweets for better ranking
    )
    SELECT * FROM ranked_tweets
    ORDER BY (0.7 * bm25_score) - (0.3 * distance) DESC
    LIMIT 25;
  `;

  const client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
  });
  await client.connect();
  const formattedEmbedding = `[${queryEmbedding.join(",")}]`;

  const { rows } = await client.query(sql, [formattedEmbedding, userQuery]);

  const systemPrompt = ReplyGenerator;

  const userPrompt = UserPrompt(userQuery, JSON.stringify(rows));

  const response = await axios.post(
    "https://api.hyperbolic.xyz/v1/chat/completions",
    {
      model: "deepseek-ai/DeepSeek-R1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      top_p: 0.3,
      max_tokens: 2000,
      stream: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
}
