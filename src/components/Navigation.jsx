import styles from './Navigation.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuthGroups } from '../hooks/useAuthGroups';
import { signOut } from 'aws-amplify/auth';
import { useState } from 'react';

import logo from '../assets/images/logo.png'
import { AnnouncementBar } from '../widgets/AnnouncementBar';
import Sidebar from './Sidebar';

import { SignInIcon, SignOutIcon, MenuIcon } from './icons';

export default function Navigation() {
  const { groups, hasGroup, isAuthenticated } = useAuthGroups();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <div className="fixed w-full">
        <AnnouncementBar />
        <nav className={`${styles.nav} p-4 flex gap-4 items-center bg-red-900 shadow-sm relative z-50`}>
          <div className="font-bold text-xl text-gray-800">
            <img src={logo} width={120} alt="Logo" />
          </div>

          {/* Botón hamburguesa - Solo visible en móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden ml-auto text-white p-2 hover:bg-red-800 rounded transition-colors"
            aria-label="Abrir menú"
            aria-expanded={isMobileMenuOpen}
          >
            <MenuIcon />
          </button>

          {/* Enlaces de navegación - Ocultos en móvil, visibles en desktop */}
          <div className="hidden md:flex gap-4 ml-auto">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`no-underline px-4 py-2 rounded transition-colors ${isActive('/')
                ? `text-white ${styles.linkActive}`
                : 'bg-transparent text-blue-500 hover:bg-blue-50'
                }`}
            >
              Inicio
            </Link>

            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`no-underline px-4 py-2 rounded transition-colors ${isActive('/about')
                ? `text-white ${styles.linkActive}`
                : 'bg-transparent text-white hover:underline'
                }`}
            >
              Nosotros
            </Link>

            {hasGroup('Allies') && (
              <Link
                to="/allies"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`no-underline px-4 py-2 rounded transition-colors ${isActive('/allies')
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-blue-500 hover:bg-blue-50'
                  }`}
              >
                Aliados
              </Link>
            )}

            {hasGroup('Admin') && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`no-underline px-4 py-2 rounded transition-colors ${isActive('/admin')
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-blue-500 hover:bg-blue-50'
                  }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Información de usuario y acciones - Desktop */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-300 pl-4 border-l border-gray-400">
                  Grupos: <span className="font-medium">{groups.join(', ').replace('Viewer', 'Invitado') || 'Ninguno'}</span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="ml-4 p-2 text-white hover:text-red-200 hover:bg-red-800 rounded transition-colors flex items-center gap-2"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <SignOutIcon />
                  <span className="text-sm font-medium">Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="ml-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors flex items-center gap-2"
                title="Iniciar sesión"
                aria-label="Iniciar sesión"
              >
                <SignInIcon />
                <span className="text-sm font-medium">Ingresar</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (<Sidebar setIsMobileMenuOpen={setIsMobileMenuOpen}/>)}
      </div>
    </>
  );
}
