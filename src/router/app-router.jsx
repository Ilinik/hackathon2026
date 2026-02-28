import { StaticLinks } from '@/constants/static-links';

import { Routes, Route } from 'react-router';
import { routeConfig } from './config.js';

export const AppRouter = () => {
  return (
    <Routes>
      {routeConfig.map(({ path, Component }) => (
        <Route
          index
          path={path}
          Component={Component}
        />
      ))}
    </Routes>
  );
};
