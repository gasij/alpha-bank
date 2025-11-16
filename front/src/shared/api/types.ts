export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface ChatRequest {
  message: string;
  category?: string;
  context?: Record<string, any>;
  chatId?: string;
}

export interface ChatResponse {
  response: string;
  category: string;
  suggestions?: string[];
  chatId?: string;
}

export interface ProviderInfo {
  provider: string;
  model: string;
  fallbackModel?: string;
  available?: boolean;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export interface ChatHistoryResponse {
  id: string;
  messages: MessageResponse[];
  category: string;
  createdAt: string;
  title: string;
}

export interface MessageResponse {
  id: string;
  role: string;
  text: string;
  timestamp: string;
  suggestions?: string[];
}

