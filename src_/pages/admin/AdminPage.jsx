import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useAuthGroups } from '../../hooks/useAuthGroups';

export default function AdminPage() {
  const navigate = useNavigate();
  const { groups: userGroups } = useAuthGroups();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-gray-600 mb-2">Bienvenido al panel de administración.</p>
      <p className="mb-6">Tu grupo actual: <strong className="text-blue-600">{userGroups.join(', ') || 'Ninguno'}</strong></p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Funciones de Administrador</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Gestión de usuarios</li>
          <li>Configuración del sistema</li>
          <li>Reportes y estadísticas</li>
        </ul>
      </div>

      <button 
        onClick={handleSignOut}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
