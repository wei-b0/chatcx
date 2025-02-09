import axios from "axios";
import { API_URL, API_KEY } from "../config/env";

export const fetchCryptoriaResponse = async (
  query: string
): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      { query },
      { headers: { "x-api-key": API_KEY }, timeout: 360000 }
    );
    return response.data.chatId || "⚠️ AI is currently unavailable.";
  } catch (error) {
    console.error("AI API Error:", error);
    return "⚠️ AI service is currently down. Please try again later.";
  }
};
