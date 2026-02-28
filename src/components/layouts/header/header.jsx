import { Button } from '@/components/ui/button';
import { Container } from '../container';
import { Link, useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LogOutIcon, SettingsIcon, UserLock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StaticLinks } from '@/constants/static-links.js';

export const Header = () => {
  const { isAuth, logout, user } = useAuth();

  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate(StaticLinks.home);
  };

  return (
    <header className="py-5">
      <Container>
        <div className="flex items-center justify-between">
          <Link to={'/'} className="text-xl font-bold">
            Hackathon
          </Link>
          <div className="flex gap-6">
            <ThemeToggle />
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {user.surname} {user.name.charAt(0)}.{' '}
                    {user.patronymic.charAt(0)}.
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate(StaticLinks.adminHome)}
                      >
                        <UserLock />
                        Админ панель
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem variant="destructive" onClick={onLogout}>
                    <LogOutIcon />
                    Выйти из аккаунта
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant={'outline'} onClick={() => navigate('/login')}>
                  Войти
                </Button>
                <Button onClick={() => navigate('/registration')}>
                  Регистрация
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
