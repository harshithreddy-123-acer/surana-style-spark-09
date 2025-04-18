
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error in Gemini chat:', error);
      throw error;
    }
  }
}

let geminiServiceInstance: GeminiService | null = null;

export const getGeminiService = (apiKey: string): GeminiService => {
  if (!geminiServiceInstance || !apiKey) {
    geminiServiceInstance = new GeminiService(apiKey);
  }
  return geminiServiceInstance;
};
