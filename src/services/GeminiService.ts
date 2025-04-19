
export class GeminiService {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  private model = "gemini-2.0-flash";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API error:', error);
        throw new Error(error.error?.message || 'Failed to get response from Gemini');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
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
