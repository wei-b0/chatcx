import express from "express";
import multer from "multer";
import { insertTopAccounts, getTopAccounts } from "./utils";
import { start } from "../cron/start";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/insert", upload.single("file"), async (req: any, res: any) => {
  const { password } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }
  if (password !== process.env.UPLOAD_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const insertedCount = await insertTopAccounts(req.file.buffer);
    res.json({ success: true, inserted: insertedCount });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

router.get("/", async (_req, res) => {
  try {
    const accounts = await getTopAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

router.post("/force-update", async (req: any, res: any) => {
  try {
    const { password } = req.body;

    if (password !== process.env.UPLOAD_PASSWORD) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await start();

    res.json({ success: true, message: "Dataset updated." });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
});

export default router;
