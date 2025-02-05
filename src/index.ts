import * as dotenv from "dotenv";
import { answerQuery } from "./llm/answer";

dotenv.config();

answerQuery("What emerging trends are being discussed in crypto right now?")
  .then((answer) => {
    console.log("LLM Answer:", answer);
  })
  .catch((error) => {
    console.error("Error answering query:", error);
  });
