import { StaticLinks } from '@/constants/static-links';
import { HomePage } from '@/pages/home-page';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import AdminUsersRolesPanel from '@/pages/admin-page/admin-page.jsx';

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
    path: StaticLinks.admin,
    Component: AdminUsersRolesPanel,
  }
];
