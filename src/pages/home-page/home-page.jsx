import { Container } from '@/components/layouts/container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const HomePage = () => {
  const { isAuth, user } = useAuth();
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
      </Container>
    </div>
  );
};
