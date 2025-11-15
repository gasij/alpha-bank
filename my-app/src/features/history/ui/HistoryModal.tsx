import React, { useState, useEffect } from 'react';
import { Message } from '@/entities/message/model/types';
import { Icon } from 'shared/ui/Icon';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { businessAssistantApi } from 'shared/api/businessAssistantApi';
import { ChatHistoryResponse, MessageResponse } from 'shared/api/types';
import { useAuth } from 'shared/lib/AuthContext';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadHistory?: (messages: Message[], chatId?: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onLoadHistory,
}) => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState<ChatHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadHistory();
    }
  }, [isOpen, isAuthenticated]);

  const loadHistory = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await businessAssistantApi.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const convertToMessages = (historyItem: ChatHistoryResponse): Message[] => {
    return historyItem.messages.map((msg: MessageResponse) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      text: msg.text,
      createdAt: new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      suggestions: msg.suggestions,
    }));
  };

  const handleLoad = async (historyItem: ChatHistoryResponse) => {
    try {
      // Загружаем полный чат с сервера
      const fullChat = await businessAssistantApi.getChatById(historyItem.id);
      const messages = convertToMessages(fullChat);
      if (onLoadHistory) {
        onLoadHistory(messages, fullChat.id);
      }
      onClose();
    } catch (error) {
      console.error('Ошибка загрузки чата:', error);
      // Если не удалось загрузить, используем данные из списка
      const messages = convertToMessages(historyItem);
      if (onLoadHistory) {
        onLoadHistory(messages, historyItem.id);
      }
      onClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Удалить этот запрос из истории?')) {
      try {
        await businessAssistantApi.deleteHistory(id);
        setHistory(history.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Ошибка удаления истории:', error);
        alert('Ошибка при удалении запроса');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-scale-in border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Для просмотра истории необходимо войти в систему
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col animate-scale-in border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">История запросов</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-lg glow-outline"
              aria-label="Закрыть"
            >
              <Icon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="flex gap-2 items-center justify-center">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">История пуста</p>
              <p className="text-sm">Ваши запросы будут сохраняться здесь</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`
                    p-4 rounded-lg border border-border cursor-pointer transition-all glow-outline
                    hover:bg-primary/5 hover:border-primary/30
                    ${selectedId === item.id ? 'bg-primary/10 border-primary' : 'bg-white'}
                  `}
                  onClick={() => handleLoad(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(item.createdAt)} • {item.category}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.messages.find(m => m.role === 'user')?.text || ''}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="ml-4 text-destructive hover:text-destructive/80 transition-colors p-2 hover:bg-destructive/10 rounded-lg glow-outline"
                      title="Удалить"
                      aria-label="Удалить"
                    >
                      <Icon icon={FiTrash2} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
