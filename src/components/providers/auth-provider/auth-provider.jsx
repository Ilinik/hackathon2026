import { AuthContext } from '@/contexts/auth-context';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AuthService from '@/services/auth-service';
import { useState } from 'react';

export const AuthProvider = ({ children }) => {
  const { removeItem, setItem } = useLocalStorage();
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckAuthLoading, setIsCheckAuthLoading] = useState(false);

  const registration = async ({
    email,
    password,
    name,
    surname,
    patronymic,
    age,
    parentFullName,
    parentPhone,
  }) => {
    setIsLoading(true);
    try {
      const response = await AuthService.registration(
        email,
        password,
        name,
        surname,
        patronymic,
        age,
        parentFullName,
        parentPhone,
      );
      console.log(response);
      const { accessToken, ...userData } = response.data;
      setUser(userData);
      setItem('token', accessToken);
      setIsAuth(true);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password);
      const { accessToken, ...userData } = response.data;
      setUser(userData);
      setItem('token', accessToken);
      setIsAuth(true);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    removeItem('token');
    setUser(null);
    setIsAuth(false);
  };

  const checkAuth = async () => {
    setIsCheckAuthLoading(true);

    try {
      const response = await AuthService.checkAuth();

      setUser(response.data);
      setIsAuth(true);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setIsCheckAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        registration,
        login,
        logout,
        checkAuth,
        isCheckAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
