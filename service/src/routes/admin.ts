import express from "express";
import multer from "multer";
import { insertTopAccounts } from "../TwitterPipeline";
import { start } from "../cron/start";
import { authenticateAPIKey } from "../middlewares";
import pool from "../db";

let lastUpdated: string | null = new Date().toUTCString();

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/insert",
  authenticateAPIKey(["admin"]),
  upload.single("file"),
  async (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    try {
      const insertedCount = await insertTopAccounts(req.file.buffer);
      res.json({ success: true, inserted: insertedCount });
    } catch (error) {
      res.status(500).json({ error: JSON.stringify(error) });
    }
  }
);

router.post(
  "/force-update",
  authenticateAPIKey(["admin"]),
  async (_req: any, res: any) => {
    try {
      await start();
      lastUpdated = new Date().toISOString();
      res.json({ success: true, message: "Dataset updated." });
    } catch (error) {
      res.status(500).json({ error: JSON.stringify(error) });
    }
  }
);

router.post(
  "/add-credits",
  authenticateAPIKey(["admin"]),
  async (req: any, res: any) => {
    try {
      const { user_id, credits } = req.body;

      if (!user_id || !credits) {
        return res
          .status(400)
          .json({ success: false, error: "Missing parameters." });
      }

      const result = await pool.query(
        `UPDATE user_credits SET credits = credits + $1 WHERE user_id = $2 RETURNING *`,
        [credits, user_id]
      );

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: "User not found." });
      }

      res.json({
        success: true,
        message: `Added ${credits} credits to user ${user_id}.`,
      });
    } catch (error) {
      console.error("Error updating credits:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/api-keys",
  authenticateAPIKey(["admin"]),
  async (req: any, res: any) => {
    const { role, username } = req.body;
    if (!role || !["admin", "app"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be 'admin' or 'app'." });
    }

    try {
      const apiKey = `cryptoria_${Math.random().toString(36).substr(2, 32)}`;
      await pool.query(
        "INSERT INTO api_keys (key, role, username) VALUES ($1, $2, $3)",
        [apiKey, role, username]
      );

      res.json({ success: true, apiKey, role });
    } catch (error) {
      console.error("Error generating API key:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/api-keys", authenticateAPIKey(["admin"]), async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT key, role, username, created_at FROM api_keys"
    );
    res.json({ success: true, apiKeys: result.rows });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/api-keys/:apiKey",
  authenticateAPIKey(["admin"]),
  async (req: any, res: any) => {
    const { apiKey } = req.params;

    try {
      const result = await pool.query(
        "DELETE FROM api_keys WHERE key = $1 RETURNING *",
        [apiKey]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "API key not found." });
      }

      res.json({ success: true, message: "API key deleted successfully." });
    } catch (error) {
      console.error("Error deleting API key:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export { router as adminRouter, lastUpdated };
