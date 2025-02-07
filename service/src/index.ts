import express from "express";
import * as dotenv from "dotenv";
import { chatRouter } from "./routes/chat";
import { generalRouter } from "./routes/general";
import { adminRouter } from "./routes/admin";

dotenv.config();
const PORT = 7886;
const API_PREFIX = "/api";

const app = express();
app.use(express.json());

app.use(`${API_PREFIX}`, chatRouter);
app.use(`${API_PREFIX}`, generalRouter);
app.use(`${API_PREFIX}/admin`, adminRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
