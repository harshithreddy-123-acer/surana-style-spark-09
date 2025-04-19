export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
