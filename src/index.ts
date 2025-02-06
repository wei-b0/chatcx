import express from "express";
import { answerQuery } from "./llm";
import { runCronJob } from "./cron";
import * as dotenv from "dotenv";
import topAccountsRouter from "./TwitterPipeline/topAccountsRouter";

dotenv.config();
const PORT = 7886;
const API_PREFIX = "/api";

let lastUpdated: string | null = null;

const app = express();
app.use(express.json());

app.use(`${API_PREFIX}/top-accounts`, topAccountsRouter);

app.post(`${API_PREFIX}/chat`, async (req: any, res: any) => {
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
});

app.get(`${API_PREFIX}/health`, (_req: any, res: any) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

app.get(`${API_PREFIX}/last-updated`, (_req: any, res: any) => {
  if (!lastUpdated) {
    return res.status(404).json({ error: "Cron job has not run yet." });
  }
  res.json({ lastUpdated });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  runCronJob((timestamp) => {
    lastUpdated = timestamp;
  });
});
