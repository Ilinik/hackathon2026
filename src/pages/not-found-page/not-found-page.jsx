import { useNavigate } from 'react-router';
import { StaticLinks } from '@/constants/static-links';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
      <h1 className="text-8xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Страница не найдена</h2>
      <p className="text-gray-400">Запрашиваемая страница не существует или была удалена</p>
      <Button onClick={() => navigate(StaticLinks.home)}>На главную</Button>
    </div>
  );
};
