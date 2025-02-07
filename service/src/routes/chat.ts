import express from "express";
import { answerQuery } from "../llm";
import { lastUpdated } from "./admin";
import { authenticateAPIKey } from "../middlewares";

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

    try {
      const rawAnswer = await answerQuery(query);

      const thinkBlockMatch = rawAnswer.match(/<think>([\s\S]*?)<\/think>/);
      const thinkBlock = thinkBlockMatch ? thinkBlockMatch[1].trim() : null;

      const cleanedAnswer = rawAnswer
        .replace(/<think>[\s\S]*?<\/think>\n*/, "")
        .trim();

      res.json({
        success: true,
        think: thinkBlock,
        answer: cleanedAnswer,
        metadata: {
          last_updated: lastUpdated,
        },
      });
    } catch (error) {
      console.error("Error answering query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export { router as chatRouter };
