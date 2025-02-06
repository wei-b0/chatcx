import express from "express";
import { answerQuery } from "./llm";
import { runCronJob } from "./cron";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 7668;

let lastUpdated: string | null = null;

app.get("/query", async (req: any, res: any) => {
  const query = req.query.text as string;
  if (!query) {
    return res
      .status(400)
      .json({ error: "Query parameter 'text' is required." });
  }

  try {
    const answer = await answerQuery(query);
    res.json({ answer });
  } catch (error) {
    console.error("Error answering query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/health", (_req: any, res: any) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

app.get("/last-updated", (_req: any, res: any) => {
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
