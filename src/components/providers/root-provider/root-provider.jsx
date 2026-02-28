import { AuthProvider } from '../auth-provider';
import { ThemeProvider } from '../theme-provider';

export const RootProvider = ({ children }) => {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
