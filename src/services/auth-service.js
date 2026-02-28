import axiosClient from '@/api';

export default class AuthService {
  static async login(email, password) {
    return axiosClient.post('/api/auth/login', { email, password });
  }

  static async registration(
    email,
    password,
    name,
    surname,
    patronymic,
    age,
    parentFullName,
    parentPhone,
  ) {
    return axiosClient.post('/api/auth/register', {
      email,
      password,
      name,
      surname,
      patronymic,
      age,
      parentFullName,
      parentPhone,
    });
  }

  static async checkAuth() {
    return axiosClient.get('/api/auth/me');
  }

  static async logout() {
    return axiosClient.post('/api/logout');
  }
}
