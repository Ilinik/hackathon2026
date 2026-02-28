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
import { LogOutIcon, SettingsIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { isAuth, logout } = useAuth();

  const navigate = useNavigate();

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
                  <Button variant="outline">My profile</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Настройки
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    variant="destructive"
                    onClick={() => {
                      logout();
                    }}
                  >
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
