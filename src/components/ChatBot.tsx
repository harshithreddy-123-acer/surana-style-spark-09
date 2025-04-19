
import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bot } from 'lucide-react';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import ApiKeySetup from './chat/ApiKeySetup';
import { useChat } from '@/hooks/useChat';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useApiKeyManagement } from '@/hooks/useApiKeyManagement';

const ChatBot = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    apiKey, 
    geminiApiKey, 
    showApiKeyInput, 
    showGeminiApiKeyInput,
    setApiKey,
    setGeminiApiKey, 
    saveApiKey, 
    saveGeminiApiKey,
    setShowApiKeyInput,
    setShowGeminiApiKeyInput
  } = useApiKeyManagement();

  const { 
    isRecording, 
    startRecording, 
    stopRecording 
  } = useVoiceRecording();

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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (showApiKeyInput || showGeminiApiKeyInput) {
    return (
      <ApiKeySetup
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
