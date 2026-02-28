import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuth: false,
  isLoading: false,
  registration: () => {},
  login: () => {},
  logout: () => {},
  checkAuth: () => {},
});
