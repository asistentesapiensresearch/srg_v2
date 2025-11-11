import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoutes } from './AdminRoutes';
import { Preloader } from '@src/components/Preloader';

/* All */
const Home = lazy(() => import("../pages/viewer/Home"));
const Layout = lazy(() => import("../pages/viewer/Layout"));
const Profile = lazy(() => import("../pages/viewer/Profile"));
const Auth = lazy(() => import("../components/Auth"));

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }
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
        idex: true,
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
            path: '',
            element: <Profile />
          }
        ]
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
  }
  /*
  
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />
  },
  // Ruta protegida para Admin
  {
    path: "/admin",
    element: <ProtectedRoute allowedGroups={['Admin']} />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <AdminPage />
          }
        ]
      }
    ]
  },
  // Ruta protegida para Allies
  {
    path: "/allies",
    element: <ProtectedRoute allowedGroups={['Allies']} />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <AlliesPage />
          }
        ]
      }
    ]
  },
  // Ruta protegida para Viewer (acceso por defecto)
  {
    path: "/viewer",
    element: <ProtectedRoute allowedGroups={['Viewer', 'Admin', 'Allies']} />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <ViewerPage />
          }
        ]
      }
    ]
  },
  // Redirección por defecto - los usuarios autenticados van a viewer
  {
    path: "/",
    element: <Navigate to="/viewer" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  */
];