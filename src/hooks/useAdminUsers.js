import { useState, useEffect, useCallback } from 'react';
import AdminService from '@/services/admin-service';

function mapApiUser(apiUser) {
  return {
    id: apiUser.id,
    fullName: [apiUser.surname, apiUser.name, apiUser.patronymic].filter(Boolean).join(' '),
    email: apiUser.email,
    status: apiUser.blocked ? 'blocked' : 'active',
    roleId: apiUser.role,
    createdAt: '—',
    lastLoginAt: '—',
    raw: {
      name: apiUser.name,
      surname: apiUser.surname,
      patronymic: apiUser.patronymic ?? '',
      age: apiUser.age,
      parentFullName: apiUser.parentFullName ?? '',
      parentPhone: apiUser.parentPhone ?? '',
    },
  };
}

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await AdminService.getUsers();
      setUsers(data.map(mapApiUser));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, formData) => {
    const { data } = await AdminService.updateUser(id, formData);
    setUsers(prev => prev.map(u => (u.id === id ? mapApiUser(data) : u)));
  }, []);

  const toggleStatus = useCallback(async (user) => {
    if (user.status === 'active') {
      await AdminService.blockUser(user.id);
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: 'blocked' } : u)));
    } else {
      await AdminService.unblockUser(user.id);
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: 'active' } : u)));
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    await AdminService.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return { users, isLoading, error, updateUser, toggleStatus, deleteUser, refetch: fetchUsers };
}
