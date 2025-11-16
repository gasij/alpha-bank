import { httpClient } from './httpClient';
import { CategoriesResponse, ChatRequest, ChatResponse, ProviderInfo, ChatHistoryResponse } from './types';

export const businessAssistantApi = {
  /**
   * Получить список категорий
   */
  async getCategories(): Promise<CategoriesResponse> {
    const response = await httpClient.get<CategoriesResponse>('/categories');
    return response.data;
  },

  /**
   * Отправить сообщение в чат
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await httpClient.post<ChatResponse>('/chat', {
      message: request.message,
      category: request.category || 'general',
      context: request.context,
      chatId: request.chatId,
    });
    return response.data;
  },

  /**
   * Получить информацию о провайдере
   */
  async getProviderInfo(): Promise<ProviderInfo> {
    const response = await httpClient.get<ProviderInfo>('/provider/info');
    return response.data;
  },

  /**
   * Проверить статус провайдера
   */
  async getProviderStatus(): Promise<ProviderInfo> {
    const response = await httpClient.get<ProviderInfo>('/provider/status');
    return response.data;
  },

  /**
   * Проверить здоровье сервиса
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await httpClient.get<{ status: string }>('/health');
    return response.data;
  },

  /**
   * Получить историю запросов пользователя
   */
  async getHistory(): Promise<ChatHistoryResponse[]> {
    const response = await httpClient.get<ChatHistoryResponse[]>('/history');
    return response.data;
  },

  /**
   * Удалить запрос из истории
   */
  async deleteHistory(id: string): Promise<void> {
    await httpClient.delete(`/history/${id}`);
  },

  /**
   * Получить чат по ID
   */
  async getChatById(id: string): Promise<ChatHistoryResponse> {
    const response = await httpClient.get<ChatHistoryResponse>(`/history/${id}`);
    return response.data;
  },

  /**
   * Создать новый чат
   */
  async createNewChat(category: string = 'general'): Promise<ChatHistoryResponse> {
    const response = await httpClient.post<ChatHistoryResponse>('/history/new', { category });
    return response.data;
  },
};
