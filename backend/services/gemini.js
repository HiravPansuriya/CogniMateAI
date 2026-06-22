import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export const generateContent = async (prompt, retries = 5) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data?.error;

    if ((status === 503 || status === 429 || errorData?.status === "RESOURCE_EXHAUSTED") && retries > 0) {
      const waitTime = (status === 429 || errorData?.status === "RESOURCE_EXHAUSTED") ? 15000 * (6 - retries) : 2000;
      console.log(`Gemini API ${status || errorData?.status} error, retrying in ${waitTime/1000}s... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return generateContent(prompt, retries - 1);
    }
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Gemini content generation failed");
  }
};

export const generateEmbeddings = async (text, retries = 3) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/gemini-embedding-001:embedContent?key=${API_KEY}`,
      {
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text }],
        },
        // Force dimension to 768 to match Pinecone index
        outputDimensionality: 768,
      }
    );

    return response.data.embedding.values;
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data?.error;
    
    // Check for rate limit (429) or service unavailable (503)
    if ((status === 429 || status === 503 || errorData?.status === "RESOURCE_EXHAUSTED") && retries > 0) {
      const waitTime = status === 429 ? 15000 * (4 - retries) : 2000; // Exponential-ish backoff
      console.log(`Gemini Embedding API ${status || errorData?.status} error, retrying in ${waitTime/1000}s... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return generateEmbeddings(text, retries - 1);
    }

    console.error("Gemini Embedding Error:", error.response?.data || error.message);
    throw new Error("Gemini embedding generation failed");
  }
};
