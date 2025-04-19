
import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useChat } from '@/hooks/useChat';
import ApiKeyForm from './chat/ApiKeyForm';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('runwareApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('runwareApiKey'));
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [showGeminiApiKeyInput, setShowGeminiApiKeyInput] = useState(!localStorage.getItem('geminiApiKey'));

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { messages, isLoading, handleSendMessage: sendMessage } = useChat();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    sendMessage(inputValue, apiKey, geminiApiKey);
    setInputValue('');
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
        
        setIsRecording(false);
        setTimeout(() => {
          const simulatedText = "I'd like to redesign my living room with a modern style";
          setInputValue(simulatedText);
          
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

  const saveGeminiApiKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem('geminiApiKey', geminiApiKey);
      setShowGeminiApiKeyInput(false);
      toast.success('Gemini API key saved!');
    } else {
      toast.error('Please enter a valid Gemini API key');
    }
  };

  if (showApiKeyInput || showGeminiApiKeyInput) {
    return (
      <ApiKeyForm
        apiKey={apiKey}
        geminiApiKey={geminiApiKey}
        setApiKey={setApiKey}
        setGeminiApiKey={setGeminiApiKey}
        saveApiKey={saveApiKey}
        saveGeminiApiKey={saveGeminiApiKey}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border shadow-lg h-[700px] flex flex-col">
        <div className="bg-accent/10 p-4 flex items-center gap-2">
          <Bot className="h-6 w-6 text-accent" />
          <h2 className="text-xl font-serif font-bold">Surana Design Assistant</h2>
        </div>
        
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        
        <Separator />
        
        <div className="p-4">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            toggleRecording={toggleRecording}
            isLoading={isLoading}
            handleKeyPress={handleKeyPress}
          />
          
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
      </Card>
    </div>
  );
};

export default ChatBot;
