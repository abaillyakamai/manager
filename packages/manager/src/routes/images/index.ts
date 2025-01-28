import { createRoute, redirect } from '@tanstack/react-router';

import { rootRoute } from '../root';
import { ImagesRoute } from './ImagesRoute';

import type { TableSearchParams } from '../types';

export type ImagesCreateState = {
  imageDescription?: string;
  imageLabel?: string;
};

export interface ImagesSearchParams extends TableSearchParams {
  query?: string;
}

export interface ImageCreateDiskSearchParams {
  selectedDiskFromSearch?: string;
  selectedLinodeFromSearch?: string;
}

export interface ImageCreateUploadSearchParams {
  imageDescription?: string;
  imageLabel?: string;
}

const imageActions = {
  delete: 'delete',
  deploy: 'deploy',
  edit: 'edit',
  manageReplicas: 'manageReplicas',
  rebuild: 'rebuild',
} as const;

export type ImageAction = typeof imageActions[keyof typeof imageActions];

const imagesRoute = createRoute({
  component: ImagesRoute,
  getParentRoute: () => rootRoute,
  path: 'images',
});

const imagesIndexRoute = createRoute({
  getParentRoute: () => imagesRoute,
  path: '/',
  validateSearch: (search: ImagesSearchParams) => search,
}).lazy(() =>
  import('./imagesLazyRoutes').then((m) => m.imagesLandingLazyRoute)
);

const imageActionRoute = createRoute({
  beforeLoad: async ({ params }) => {
    if (!(params.action in imageActions)) {
      throw redirect({
        search: () => ({}),
        to: '/images',
      });
    }
  },
  getParentRoute: () => imagesRoute,
  path: '$imageId/$action',
  validateSearch: (search: ImagesSearchParams) => search,
}).lazy(() =>
  import('./imagesLazyRoutes').then((m) => m.imagesLandingLazyRoute)
);

const imagesCreateRoute = createRoute({
  getParentRoute: () => imagesRoute,
  path: 'create',
}).lazy(() => import('./imagesLazyRoutes').then((m) => m.imageCreateLazyRoute));

const imagesCreateIndexRoute = createRoute({
  beforeLoad: () => {
    throw redirect({
      to: '/images/create/disk',
    });
  },
  getParentRoute: () => imagesCreateRoute,
  path: '/',
});

const imagesCreateDiskRoute = createRoute({
  getParentRoute: () => imagesCreateRoute,
  path: 'disk',
  validateSearch: (search: ImageCreateDiskSearchParams) => search,
}).lazy(() => import('./imagesLazyRoutes').then((m) => m.imageCreateLazyRoute));

const imagesCreateUploadRoute = createRoute({
  getParentRoute: () => imagesCreateRoute,
  path: 'upload',
  validateSearch: (search: ImageCreateUploadSearchParams) => search,
}).lazy(() => import('./imagesLazyRoutes').then((m) => m.imageCreateLazyRoute));

export const imagesRouteTree = imagesRoute.addChildren([
  imagesIndexRoute.addChildren([imageActionRoute]),
  imagesCreateRoute.addChildren([
    imagesCreateIndexRoute,
    imagesCreateDiskRoute,
    imagesCreateUploadRoute,
  ]),
]);
