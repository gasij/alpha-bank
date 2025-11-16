import React from 'react';
import { Message } from '../model/types';

interface MessageItemProps {
  message: Message;
  onSuggestionClick?: (suggestion: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onSuggestionClick }) => {
  const formatTime = (time: string) => {
    return time;
  };

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm text-center italic animate-scale-in">
        {message.text}
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col max-w-[80%] sm:max-w-[75%] 
        animate-fade-in-up
        transition-all duration-300 hover:scale-[1.01]
        ${isUser ? 'self-end' : 'self-start'}
      `}
    >
      <div
        className={`
          px-4 py-3 rounded-2xl relative
          transition-all duration-300
          hover:shadow-md
          ${
            isUser
              ? 'bg-primary text-white rounded-br-md shadow-md'
              : 'bg-muted text-foreground border border-border rounded-bl-md'
          }
        `}
      >
        <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </div>
        <div className="text-xs opacity-70 mt-2 transition-opacity hover:opacity-100">
          {formatTime(message.createdAt)}
        </div>
      </div>
      {message.suggestions && message.suggestions.length > 0 && !isUser && (
        <div className="flex flex-wrap gap-2 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSuggestionClick?.(suggestion)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-primary/30 text-primary rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all hover:scale-105 active:scale-95 hover:shadow-sm animate-scale-in glow-outline"
              style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
