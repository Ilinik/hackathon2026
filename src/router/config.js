import { StaticLinks } from '@/constants/static-links';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import { AdminPage } from '@/pages/admin-page';
import { NotFoundPage } from '@/pages/not-found-page';

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
  {
    path: '*',
    Component: NotFoundPage,
  },
];

export const adminRouteConfig = [
  {
    path: StaticLinks.adminHome,
    Component: AdminPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];
