import { httpClient } from './httpClient';
import { RegisterRequest, LoginRequest, AuthResponse, User, UpdateProfileRequest } from './types';

export const authApi = {
  /**
   * Регистрация нового пользователя
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/register', request);
    if (response.data.token) {
      httpClient.setToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Вход в систему
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', request);
    if (response.data.token) {
      httpClient.setToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Получить текущего пользователя
   */
  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Обновить профиль пользователя
   */
  async updateProfile(request: UpdateProfileRequest): Promise<User> {
    const response = await httpClient.put<User>('/auth/profile', request);
    return response.data;
  },

  /**
   * Выход из системы
   */
  logout() {
    httpClient.clearToken();
  },

  /**
   * Проверить, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    return httpClient.getToken() !== null;
  },
};

