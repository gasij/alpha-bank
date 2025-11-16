import React from 'react';
import { Message } from '../model/types';
import { MessageItem } from './MessageItem';

interface MessagesListProps {
  messages: Message[];
  onSuggestionClick?: (suggestion: string) => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, onSuggestionClick }) => {
  return (
    <>
      {messages.map((msg, index) => (
        <MessageItem 
          key={msg.id} 
          message={msg}
          onSuggestionClick={onSuggestionClick}
        />
      ))}
    </>
  );
};
