import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Acceso Denegado</h1>
      <p className="text-gray-600 mb-2">No tienes permisos para acceder a esta sección.</p>
      <p className="text-gray-600 mb-6">Por favor, contacta a un administrador si crees que esto es un error.</p>
      
      <button 
        onClick={() => navigate('/viewer')}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
      >
        Ir a Mi Panel
      </button>
    </div>
  );
}
