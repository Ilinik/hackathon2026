import { StaticLinks } from '@/constants/static-links';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';

export const routeConfig = [
  {
    path: StaticLinks.home,
    Component: HomePage,
  },
  {
    path: StaticLinks.login,
    Component: LoginPage,
  },
  {
    path: StaticLinks.registration,
    Component: RegisterPage,
  },
];
