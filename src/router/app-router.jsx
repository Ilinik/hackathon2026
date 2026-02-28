import { StaticLinks } from '@/constants/static-links';

import { Routes, Route } from 'react-router';
import { routeConfig, adminRouteConfig } from './config.js';
import { useAuth } from '@/hooks/useAuth.js';
import { NotFoundPage } from '@/pages/not-found-page';

export const AppRouter = () => {
  const { user } = useAuth();

  let routes = routeConfig;

  if (user?.role === 'ADMIN') {
    routes = [...routeConfig, ...adminRouteConfig];
  }

  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route
          index
          path={path}
          Component={Component}
        />
      ))}
    </Routes>
  );
};
