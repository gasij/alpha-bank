import React, { FormEvent, useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { Icon } from 'shared/ui/Icon';

interface SendMessageFormProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export const SendMessageForm: React.FC<SendMessageFormProps> = ({
  onSend,
  isLoading = false,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 p-4 sm:p-5 border-t border-border bg-white"
    >
      <textarea
        ref={inputRef}
        className="flex-1 bg-muted rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none max-h-[150px] focus:outline-none transition-all border border-border glow-outline"
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Задайте вопрос или опишите задачу..."
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:bg-primary/80 transition-all flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg group glow-button"
        aria-label="Отправить сообщение"
      >
        <Icon icon={FiSend} className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </form>
  );
};
