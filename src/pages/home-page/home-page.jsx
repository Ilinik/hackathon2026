import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { StaticLinks } from '@/constants/static-links.js';

export const HomePage = () => {
  const { isAuth, user } = useAuth();
  const nav = useNavigate();
  return (
    <div>
      <Container>
        <div>
          {isAuth ? (
            <div className="flex flex-col gap-5">
              <div>Username: {user.username}</div>
              <div>Email: {user.email}</div>
            </div>
          ) : (
            <div>Пользователь не авторизован</div>
          )}
        </div>
        <Button
          type="button"
          variant="default"
          onClick={() => nav(StaticLinks.adminHome)}
        >
          На админ панель
        </Button>
      </Container>
    </div>
  );
};
