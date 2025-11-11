import { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

/**
 * Hook para obtener los grupos del usuario autenticado
 * @returns {Object} { groups, isAuthenticated, isLoading, hasGroup }
 */
export function useAuthGroups() {
  const [groups, setGroups] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload;
        
        if (payload) {
          const userGroups = payload['cognito:groups'] || [];
          setGroups(Array.isArray(userGroups) ? userGroups : []);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setGroups([]);
        }
      } catch (error) {
        console.log('Usuario no autenticado:', error);
        setIsAuthenticated(false);
        setGroups([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, []);

  /**
   * Verifica si el usuario pertenece a un grupo específico
   * @param {string} groupName - Nombre del grupo
   * @returns {boolean}
   */
  const hasGroup = (groupName) => {
    return groups.includes(groupName);
  };

  /**
   * Verifica si el usuario pertenece a alguno de los grupos especificados
   * @param {string[]} groupNames - Array de nombres de grupos
   * @returns {boolean}
   */
  const hasAnyGroup = (groupNames) => {
    return groupNames.some(group => groups.includes(group));
  };

  /**
   * Verifica si el usuario pertenece a todos los grupos especificados
   * @param {string[]} groupNames - Array de nombres de grupos
   * @returns {boolean}
   */
  const hasAllGroups = (groupNames) => {
    return groupNames.every(group => groups.includes(group));
  };

  return {
    groups,
    isAuthenticated,
    isLoading,
    hasGroup,
    hasAnyGroup,
    hasAllGroups,
    setIsAuthenticated
  };
}
