import { Header } from '@/components/layouts/header';
import { Toaster } from '@/components/ui/sonner';

export const PageWrapper = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Toaster />
    </div>
  );
};
