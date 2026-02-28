import axiosClient from '@/api';

export default class AuthService {
  static async login(email, password) {
    return axiosClient.post('/api/auth/login', { email, password });
  }

  static async registration(username, email, password) {
    return axiosClient.post('/api/registration', { username, email, password });
  }

  static async checkAuth() {
    return axiosClient.get('/api/auth/me');
  }

  static async logout() {
    return axiosClient.post('/api/logout');
  }
}
