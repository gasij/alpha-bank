import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class HttpClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 120000, // 2 минуты для LLM запросов
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Загружаем токен из localStorage
    this.loadToken();
    
    // Добавляем interceptor для автоматической подстановки токена
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Добавляем обработчик ошибок
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          throw new Error('Запрос занял слишком много времени. Попробуйте позже.');
        }
        
        if (error.response?.status === 503) {
          throw new Error('Сервис временно недоступен. Проверьте, что бекенд запущен.');
        }
        
        if (error.response?.data) {
          const data = error.response.data as any;
          throw new Error(data.detail || data.message || 'Произошла ошибка при выполнении запроса');
        }
        
        throw error;
      }
    );
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private loadToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.token = token;
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

export const httpClient = new HttpClient();
