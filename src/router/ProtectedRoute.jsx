// src/router/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Preloader } from '../components/Preloader';

/**
 * Componente que protege rutas basándose en grupos de Cognito
 * @param {Object} props
 * @param {string[]} props.allowedGroups - Grupos permitidos para acceder a la ruta
 * @param {boolean} props.requireAuth - Si requiere autenticación (por defecto true)
 */
export function ProtectedRoute({ allowedGroups = [], requireAuth = true }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un usuario autenticado
        await getCurrentUser();

        // Obtener la sesión y los grupos del token
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload;

        if (payload) {
          // Los grupos vienen en 'cognito:groups' en el token
          const groups = payload['cognito:groups'] || [];
          setUserGroups(Array.isArray(groups) ? groups : []);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Usuario no autenticado:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Preloader />
      </div>
    );
  }

  // Si requiere autenticación y el usuario no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay grupos permitidos, verificar que el usuario pertenezca a alguno
  if (allowedGroups.length > 0) {
    const hasAccess = allowedGroups.some(group => userGroups.includes(group));

    if (!hasAccess) {
      // Redirigir a una página de acceso denegado o al dashboard del usuario
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
