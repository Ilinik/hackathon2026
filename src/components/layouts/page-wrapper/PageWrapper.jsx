import { Header } from '@/components/layouts/header';

export const PageWrapper = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};
