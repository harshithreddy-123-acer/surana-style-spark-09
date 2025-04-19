
import { Message } from '@/types/chat';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
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
  );
};

export default MessageList;
