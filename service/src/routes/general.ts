import express from "express";
import { getTopAccounts } from "../TwitterPipeline";
import { lastUpdated } from "./admin";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const accounts = await getTopAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

router.get(`/health`, (_req: any, res: any) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

router.get(`/last-updated`, (_req: any, res: any) => {
  if (!lastUpdated) {
    return res.status(404).json({ error: "Cron job has not run yet." });
  }
  res.json({ lastUpdated });
});

export { router as generalRouter };
