import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoutes } from './AdminRoutes';
import Auth from '../components/Auth';

/* All */
import Home from "../pages/viewer/Home";
import Layout from "../pages/viewer/Layout";
import Profile from "../pages/viewer/Profile";

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
    path: 'profile',
    element: <Auth />,
    children: [
      {
        path: '',
        element: <Layout/>,
        children: [
          {
            path: '',
            element: <Profile/>
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