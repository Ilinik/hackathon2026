import { Container } from '@/components/layouts/container';
import { useAuth } from '@/hooks/useAuth';

export const HomePage = () => {
  const { isAuth, user } = useAuth();
  return (
    <div>
      <Container>
        <div>
          {isAuth ? (
            <div className="flex flex-col gap-5">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {user.surname} {user.name}  {user.patronymic}
              </h2>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Почта: {user.email}
              </h3>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Роль: {user.role}
              </h3>
            </div>
          ) : (
            <div>Пользователь не авторизован</div>
          )}
        </div>
      </Container>
    </div>
  );
};
