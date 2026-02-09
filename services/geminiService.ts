
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getExplanation = async (question: string, options: string[], correctAnswer: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an elite tutor for professional aptitude tests (Management Consulting, Investment Banking, Tech Strategy). 
        Provide a concise, step-by-step logic explanation for the following question.
        
        Question: ${question}
        Options: ${options.join(', ')}
        Correct Answer: ${correctAnswer}
        
        Format the explanation in clear Markdown. Focus on the mathematical or logical derivation.
      `,
    });

    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to load AI explanation. Please check your connection.";
  }
};
