import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the AI client
const getAiClient = () => {
  if (!apiKey) {
    console.warn("API_KEY is not defined.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePoeticCaption = async (description: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "The API key is missing, but the memory remains vivid in our hearts.";
  }

  try {
    const prompt = `
      You are a nostalgic, sentimental poet. 
      I will give you a description of a photo. 
      Please write a very short, warm, and emotional caption (max 2 sentences) that captures the feeling of "You live once" and the fleeting nature of time.
      Do not be overly dramatic, just soft and reminiscent.
      
      Photo description: "${description}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "A moment frozen in time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A timeless memory, captured forever.";
  }
};
