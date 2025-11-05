import { ProtectedRoute } from './ProtectedRoute';
import { Authenticator } from '@aws-amplify/ui-react';

import { AdminRoutes } from './AdminRoutes';

/* All */
import Home from "../pages/viewer/Home";
import Layout from "../pages/viewer/Layout";

export const routes = [
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      }
    ]
  },
  {
    path: "/admin",
    element: (
      <Authenticator>
        <ProtectedRoute allowedGroups={['Admin']} />
      </Authenticator>
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