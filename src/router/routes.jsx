// src/router/routes.jsx
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoutes } from './AdminRoutes';
import { Preloader } from '@src/components/Preloader';
import { Navigate } from 'react-router-dom';

/* Viewer Pages */
const Home = lazy(() => import("../pages/viewer/home/Home"));
const Layout = lazy(() => import("../pages/viewer/Layout"));
const Profile = lazy(() => import("../pages/viewer/Profile"));
const ResearchDetail = lazy(() => import("../pages/viewer/ResearchDetail"));
const Auth = lazy(() => import("../components/auth"));

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: 'profile',
    element: (
      <Auth>
        <ProtectedRoute allowedGroups={['Admin', 'viewer', 'Allies']} />
      </Auth>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}>
              <Preloader />
            </div>
          }>
            <Profile />
          </Suspense>
        ),
      }
    ]
  },
  {
    path: "/admin",
    element: (
      <Auth>
        <ProtectedRoute allowedGroups={['Admin']} />
      </Auth>
    ),
    children: AdminRoutes
  },
  // Ruta dinámica para investigaciones (debe ir al final antes del wildcard)
  {
    path: "/:path",
    element: (
      <Suspense fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <Preloader />
        </div>
      }>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <ResearchDetail />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
];