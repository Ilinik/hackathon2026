import { useEffect } from 'react';
import { PageWrapper } from './components/layouts/page-wrapper/PageWrapper';
import { RootProvider } from './components/providers/root-provider';
import { AppRouter } from './router';
import { useAuth } from './hooks/useAuth';

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, []);

  return (
    <PageWrapper>
      <AppRouter />
    </PageWrapper>
  );
}

export default App;
