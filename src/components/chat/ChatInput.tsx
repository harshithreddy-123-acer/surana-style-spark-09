
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  toggleRecording: () => void;
  isLoading: boolean;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  isRecording,
  toggleRecording,
  isLoading,
  handleKeyPress,
}: ChatInputProps) => {
  return (
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
  );
};

export default ChatInput;
