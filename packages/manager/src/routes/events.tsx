import { Outlet, createRoute } from '@tanstack/react-router';
import React from 'react';

import { SuspenseLoader } from 'src/components/SuspenseLoader';

import { rootRoute } from './root';

export const EventsRoutes = () => {
  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <Outlet />
    </React.Suspense>
  );
};

export const eventsRoute = createRoute({
  component: EventsRoutes,
  getParentRoute: () => rootRoute,
  path: 'events',
});

const eventsIndexRoute = createRoute({
  getParentRoute: () => eventsRoute,
  path: '/',
}).lazy(() =>
  import('src/features/Events/EventsLanding').then(
    (m) => m.EventsLandingLazyRoute
  )
);

export const eventsRouteTree = eventsRoute.addChildren([eventsIndexRoute]);
