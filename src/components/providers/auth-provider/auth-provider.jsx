import { AuthContext } from '@/contexts/auth-context';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AuthService from '@/services/auth-service';
import axios from 'axios';
import { useState } from 'react';

export const AuthProvider = ({ children }) => {
  const { removeItem, setItem } = useLocalStorage();
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registration = async ({ username, email, password }) => {
    setIsLoading(true);
    try {
      const response = await AuthService.registration(
        username,
        email,
        password,
      );
      console.log(response);
      setUser(response.data.user);
      setItem('token', response.data.tokens.accessToken);
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
    setIsLoading(true);
    try {
      await AuthService.logout();
      removeItem('token');
      setUser(null);
      setIsAuth(false);
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/refresh`,
        { withCredentials: true },
      );
      console.log(response);
      setUser(response.data.user);
      setItem('token', response.data.tokens.accessToken);
      setIsAuth(true);
    } catch (e) {
      console.log(e);
      throw e;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
