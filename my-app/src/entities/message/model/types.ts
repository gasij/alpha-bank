export type MessageRole = 'assistant' | 'user' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: string;
  suggestions?: string[];
}
