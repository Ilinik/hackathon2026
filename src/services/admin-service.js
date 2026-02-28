import axiosClient from '@/api';

export default class AdminService {
  static async getUsers() {
    return axiosClient.get('/api/admin/users');
  }

  static async getUserById(id) {
    return axiosClient.get(`/api/admin/users/${id}`);
  }

  static async updateUser(id, data) {
    return axiosClient.patch(`/api/admin/users/${id}`, data);
  }

  static async blockUser(id) {
    return axiosClient.post(`/api/admin/users/${id}/block`);
  }

  static async unblockUser(id) {
    return axiosClient.post(`/api/admin/users/${id}/unblock`);
  }

  static async deleteUser(id) {
    return axiosClient.delete(`/api/admin/users/${id}`);
  }
}
