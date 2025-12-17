import { GoogleGenAI, Type } from "@google/genai";
import { CreateTaskDTO, Priority } from "../types";

// NOTE: In a real production app, this would be a backend endpoint to protect the API key.
// For this client-side demo, we use the injected process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTaskWithAI = async (naturalLanguageInput: string): Promise<CreateTaskDTO | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract task details from this text: "${naturalLanguageInput}". 
      Return a JSON object with title, description, priority (low, medium, or high), and dueDate (ISO 8601 format string).
      If priority is not mentioned, infer it or default to medium.
      If due date is not mentioned, set it to tomorrow's date.
      Keep the title concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
            dueDate: { type: Type.STRING },
          },
          required: ["title", "description", "priority", "dueDate"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    return data as CreateTaskDTO;
  } catch (error) {
    console.error("Gemini AI parsing failed:", error);
    return null;
  }
};