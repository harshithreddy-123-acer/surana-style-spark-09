
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, User, Bot, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getRunwareService, GeneratedImage } from './RunwareService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Surana AI, your interior design assistant. How can I help with your space today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Determine if the message is asking for a design or general advice
      const isDesignRequest = inputValue.toLowerCase().includes('design') || 
                              inputValue.toLowerCase().includes('generate') ||
                              inputValue.toLowerCase().includes('create') ||
                              inputValue.toLowerCase().includes('show me');
      
      // Create bot response
      let botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue, isDesignRequest),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      // If it's a design request and we have an API key, generate an image
      if (isDesignRequest && apiKey) {
        try {
          const prompt = `Interior design: ${inputValue}`;
          const runwareService = getRunwareService(apiKey);
          
          // Add text response
          setMessages(prev => [...prev, botResponse]);
          
          // Generate image
          const generatedImage = await runwareService.generateImage({
            positivePrompt: prompt,
            width: 1024,
            height: 768
          });
          
          // Add image response
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
          toast.error('Failed to generate image. Please check your API key.');
          
          const errorMessage: Message = {
            id: (Date.now() + 3).toString(),
            text: "I'm sorry, I couldn't generate an image at this time. Let me know if you'd like to try something else!",
            sender: 'bot',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
      } else {
        // Just add the text response if not a design request or no API key
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 4).toString(),
        text: "I'm sorry, I encountered an error. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateBotResponse = (userInput: string, isDesignRequest: boolean): string => {
    // Simple response generation for demo
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
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        
        // Here you would send this to a speech-to-text service
        // For now, we'll simulate with a timeout
        setIsLoading(true);
        setTimeout(() => {
          const simulatedText = "I'd like to redesign my living room with a modern style";
          setInputValue(simulatedText);
          setIsLoading(false);
          
          // Close all tracks to properly stop the microphone
          stream.getTracks().forEach(track => track.stop());
        }, 1500);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started. Click the button again to stop.");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Processing your voice input...");
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('runwareApiKey', apiKey);
      setShowApiKeyInput(false);
      toast.success('API key saved!');
    } else {
      toast.error('Please enter a valid API key');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border shadow-lg h-[700px] flex flex-col">
        <div className="bg-accent/10 p-4 flex items-center gap-2">
          <Bot className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-serif font-bold">Surana Design Assistant</h2>
        </div>
        
        {showApiKeyInput ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md space-y-4">
              <h3 className="text-lg font-medium">Enter your Runware AI API Key</h3>
              <p className="text-muted-foreground text-sm">
                The AI design generator requires a Runware AI API key. You can get one by signing up at{" "}
                <a href="https://runware.ai" target="_blank" rel="noreferrer" className="text-accent underline">
                  runware.ai
                </a>
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button onClick={saveApiKey} className="w-full">Save API Key</Button>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Your API key is stored locally on your device and not sent to Surana AI servers.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="break-words">{message.text}</p>
                    {message.image && (
                      <div className="mt-2">
                        <img
                          src={message.image}
                          alt="Generated design"
                          className="rounded-md max-w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <Separator />
            <div className="p-4">
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about interior design, room layout, color schemes..."
                  className="resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={toggleRecording}
                    variant="outline"
                    size="icon"
                    className={isRecording ? 'bg-red-100' : ''}
                    disabled={isLoading}
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={isLoading || inputValue.trim() === ''}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Button
                  variant="link"
                  className="text-xs text-muted-foreground"
                  onClick={() => setShowApiKeyInput(true)}
                >
                  Update API Key
                </Button>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> 
                  Try asking for design ideas
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ChatBot;
