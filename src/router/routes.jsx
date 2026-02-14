// src/router/routes.jsx
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoutes } from './AdminRoutes';
import { Preloader } from '@src/components/preloader';
// import { Navigate } from 'react-router-dom'; // YA NO LO NECESITAMOS AQUÍ

/* Viewer Pages */
const Home = lazy(() => import("../pages/viewer/home/Home"));
const Layout = lazy(() => import("../pages/viewer/Layout"));
const Profile = lazy(() => import("../pages/viewer/Profile"));
const TemplateDetail = lazy(() => import("../pages/viewer/TemplateDetail"));
const Auth = lazy(() => import("../components/auth"));

const SuspenseLoader = ({ children }) => (
  <Suspense fallback={
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Preloader />
    </div>
  }>
    {children}
  </Suspense>
);

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
          <SuspenseLoader>
            <Profile />
          </SuspenseLoader>
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
  {
    path: "/*", 
    element: (
      <SuspenseLoader>
        <Layout />
      </SuspenseLoader>
    ),
    children: [
      {
        path: '*',
        element: <TemplateDetail />
      }
    ]
  }
];