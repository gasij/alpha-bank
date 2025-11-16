import React, { useState, useRef, useEffect } from 'react';
import { MessagesList } from 'entities/message';
import { SendMessageForm } from 'features/send-message';
import { Message } from '@/entities/message/model/types';
import { businessAssistantApi } from 'shared/api/businessAssistantApi';
import { useAuth } from 'shared/lib/AuthContext';
import { Icon } from 'shared/ui/Icon';
import { FiPlus } from 'react-icons/fi';

const defaultMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    text: 'Привет! Я ваш AI-помощник для бизнеса. Чем могу помочь?',
    createdAt: new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  },
];

interface ChatWidgetProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  initialMessages?: Message[];
  initialChatId?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  selectedCategory,
  onCategoryChange,
  initialMessages,
  initialChatId,
}) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages ?? defaultMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(initialChatId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (initialChatId) {
      setCurrentChatId(initialChatId);
    }
  }, [initialChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewChat = async () => {
    if (!isAuthenticated) {
      const errorSystemMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        text: 'Для создания нового чата необходимо войти в систему.',
        createdAt: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([errorSystemMessage]);
      return;
    }

    try {
      const newChat = await businessAssistantApi.createNewChat(selectedCategory);
      setCurrentChatId(newChat.id);
      setMessages(defaultMessages);
      setError(null);
    } catch (err: any) {
      console.error('Ошибка создания нового чата:', err);
      setMessages(defaultMessages);
      setCurrentChatId(null);
    }
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    if (!isAuthenticated) {
      const errorSystemMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        text: 'Для отправки сообщений необходимо войти в систему. Нажмите кнопку "Войти" в правом верхнем углу.',
        createdAt: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorSystemMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      createdAt: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await businessAssistantApi.sendMessage({
        message: trimmed,
        category: selectedCategory,
        chatId: currentChatId || undefined,
      });

      // Сохраняем chatId из ответа
      if (response.chatId) {
        setCurrentChatId(response.chatId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.response,
        createdAt: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Ошибка при отправке сообщения:', err);
      
      const errorMessage = err.message || 'Произошла ошибка при отправке сообщения';
      setError(errorMessage);

      const errorSystemMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: `Ошибка: ${errorMessage}`,
        createdAt: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, errorSystemMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden min-h-[500px] max-h-[calc(100vh-300px)] shadow-sm border border-border animate-scale-in">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground">Чат</h3>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium glow-button"
          title="Новый чат"
        >
          <Icon icon={FiPlus} className="w-5 h-5" />
          <span className="hidden sm:inline">Новый чат</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 custom-scrollbar">
        <MessagesList messages={messages} onSuggestionClick={handleSuggestionClick} />
        {isLoading && (
          <div className="flex self-start max-w-[75%] animate-fade-in-up">
            <div className="px-4 py-3 bg-muted text-foreground border border-border rounded-2xl rounded-bl-md">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1.4s' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex self-start max-w-[75%] animate-fade-in-up">
            <div className="px-4 py-3 bg-destructive/10 text-destructive border border-destructive/30 rounded-2xl rounded-bl-md">
              <div className="text-sm font-medium">{error}</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <SendMessageForm onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};
