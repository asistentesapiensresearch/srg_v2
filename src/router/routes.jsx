import { lazy } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoutes } from './AdminRoutes';
import { AlliesRoutes } from './AlliesRoutes'; // 🔥 Importante
import { SuspenseLoader } from '../components/SuspenseLoader';
import { ProfileRoutes } from './ProfileRoutes';

/* Viewer Pages */
const Home = lazy(() => import("../pages/viewer/home/Home"));
const Layout = lazy(() => import("../pages/viewer/Layout"));
const TemplateDetail = lazy(() => import("../pages/viewer/TemplateDetail"));
const Auth = lazy(() => import("../components/auth"));

export const routes = [
  // --- PÚBLICO ---
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

  // --- PERFIL (Compartido) ---
  {
    path: 'profile',
    element: (
      // Protegemos esta sub-ruta solo para Aliados/Admin
      <Auth>
        <ProtectedRoute allowedGroups={['Admin', 'Allies', 'Viewer']} />
      </Auth>
    ),
    children: ProfileRoutes,
    title: "Perfil"
  },

  // --- ADMIN (Super Admin) ---
  {
    path: "/admin",
    element: (
      <Auth>
        <ProtectedRoute allowedGroups={['Admin']} />
      </Auth>
    ),
    children: AdminRoutes,
    title: "Administración"
  },

  // --- ALLIES (Aliados) ---
  {
    path: "/allie",
    element: (
      <Auth>
        <ProtectedRoute allowedGroups={['Allies', 'Admin']} />
        {/* Nota: A veces es útil que el Admin también pueda entrar a ver cómo se ve el panel de aliado */}
      </Auth>
    ),
    // 🔥 CORRECCIÓN: Usamos AlliesRoutes, NO AdminRoutes
    children: AlliesRoutes,
    title: "Aliados"
  },

  // --- CATCH-ALL (Micrositios y 404) ---
  // Esta ruta debe ir AL FINAL
  {
    path: "/*",
    element: (
      <SuspenseLoader>
        <Layout />
      </SuspenseLoader>
    ),
    children: [
      {
        // 🔥 CORRECCIÓN: Usamos index: true para capturar lo que venga del /* padre
        path: '*',
        element: <TemplateDetail />
      }
    ]
  }
];