import express from "express";
import { lastUpdated } from "./admin";
import { authenticateAPIKey } from "../middlewares";
import { v4 as uuidv4 } from "uuid";
import { answerQuery } from "../llm";
import pool from "../db";

const router = express.Router();

router.post(
  `/chat`,
  authenticateAPIKey(["app", "admin"]),
  async (req: any, res: any) => {
    const query = req.body.query;
    if (!query) {
      return res
        .status(400)
        .json({ error: "Body parameter 'query' is required." });
    }

    const chatId = uuidv4();
    try {
      await pool.query(
        `INSERT INTO chat_jobs (id, query, status) VALUES ($1, $2, 'processing')`,
        [chatId, query]
      );

      processJob(chatId, query);

      res.json({
        success: true,
        chatId,
        message: "Processing request, check status using /chat/:chatId.",
      });
    } catch (error) {
      console.error("Error inserting chat job:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  `/chat/:chatId`,
  authenticateAPIKey(["app", "admin"]),
  async (req: any, res: any) => {
    const { chatId } = req.params;

    try {
      const result = await pool.query(
        `SELECT status, result FROM chat_jobs WHERE id = $1`,
        [chatId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching chat job status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

const processJob = async (chatId: string, query: string) => {
  try {
    const rawAnswer = await answerQuery(query);
    const thinkBlockMatch = rawAnswer.match(/<think>([\s\S]*?)<\/think>/);
    const thinkBlock = thinkBlockMatch ? thinkBlockMatch[1].trim() : null;
    const cleanedAnswer = rawAnswer
      .replace(/<think>[\s\S]*?<\/think>\n*/, "")
      .trim();

    await pool.query(
      `UPDATE chat_jobs SET status = 'completed', result = $1, updated_at = NOW() WHERE id = $2`,
      [
        JSON.stringify({
          think: thinkBlock,
          answer: cleanedAnswer,
          metadata: { last_updated: lastUpdated },
        }),
        chatId,
      ]
    );
  } catch (error) {
    console.error("Error processing chat job:", error);
    await pool.query(
      `UPDATE chat_jobs SET status = 'failed', result = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify({ error: "Failed to process query" }), chatId]
    );
  }
};

export { router as chatRouter };
