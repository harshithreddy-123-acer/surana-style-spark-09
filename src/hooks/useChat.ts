
import { useState } from 'react';
import { Message } from '@/types/chat';
import { getGeminiService } from '@/services/GeminiService';
import { getRunwareService } from '@/components/RunwareService';
import { toast } from 'sonner';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Surana AI, your interior design assistant. How can I help with your space today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const generateBotResponse = (userInput: string, isDesignRequest: boolean): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (isDesignRequest) {
      return "I'll create a design visualization based on your request...";
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! How can I assist with your interior design project today?";
    } else if (lowerInput.includes('modern')) {
      return "Modern design emphasizes clean lines, minimal decoration, and a neutral color palette. Would you like me to suggest some modern furniture pieces or color schemes?";
    } else if (lowerInput.includes('traditional')) {
      return "Traditional design features classic elements, rich color palettes, and ornate details. It often incorporates antique-inspired furniture and symmetrical arrangements. Would you like some traditional design recommendations?";
    } else if (lowerInput.includes('color') || lowerInput.includes('palette')) {
      return "Color is crucial in interior design! For a calming space, consider blues and greens. For energy, try reds or oranges. Neutral colors like beige, gray, and white are versatile foundations. Would you like me to suggest a specific palette for your space?";
    } else if (lowerInput.includes('small') || lowerInput.includes('space')) {
      return "For small spaces, consider multi-functional furniture, light colors to create the illusion of space, and mirrors to reflect light. Vertical storage solutions can also maximize your square footage. Would you like specific recommendations for your small space?";
    } else if (lowerInput.includes('budget') || lowerInput.includes('affordable')) {
      return "Creating a beautiful space on a budget is definitely possible! Consider upcycling existing furniture, shopping secondhand, DIY projects, and focusing on impactful changes like paint and lighting. Would you like budget-friendly recommendations for a specific room?";
    } else {
      return "Thank you for sharing. To provide the best advice, could you tell me more about your space? What's your style preference, budget, and which room are you designing?";
    }
  };

  const handleSendMessage = async (inputValue: string, apiKey: string, geminiApiKey: string) => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const isDesignRequest = inputValue.toLowerCase().includes('design') || 
                            inputValue.toLowerCase().includes('generate') ||
                            inputValue.toLowerCase().includes('create') ||
                            inputValue.toLowerCase().includes('show me');
      
      let responseText = '';
      if (geminiApiKey) {
        try {
          const geminiService = getGeminiService(geminiApiKey);
          responseText = await geminiService.chat(inputValue);
        } catch (error) {
          console.error('Gemini chat error:', error);
          toast.error('Failed to get AI response. Please check your Gemini API key.');
          responseText = "I'm sorry, I couldn't process your request right now. Please try again later.";
        }
      } else {
        responseText = generateBotResponse(inputValue, isDesignRequest);
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      if (isDesignRequest && apiKey) {
        try {
          const prompt = `Interior design: ${inputValue}`;
          const runwareService = getRunwareService(apiKey);
          
          const generatedImage = await runwareService.generateImage({
            positivePrompt: prompt,
            width: 1024,
            height: 768
          });
          
          const imageMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Here's a design based on your request:",
            sender: 'bot',
            timestamp: new Date(),
            image: generatedImage.imageURL
          };
          
          setMessages(prev => [...prev, imageMessage]);
        } catch (error) {
          console.error('Image generation error:', error);
          toast.error('Failed to generate image. Please check your Runware API key.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        text: "I'm sorry, I encountered an error. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    handleSendMessage
  };
};
