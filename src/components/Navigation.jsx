import styles from './Navigation.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuthGroups } from '../hooks/useAuthGroups';
import { signOut } from 'aws-amplify/auth';
import { useState } from 'react';

import logo from '../assets/images/logo.png'
import { AnnouncementBar } from '../widgets/AnnouncementBar';
import Sidebar from './Sidebar';

import { SignInIcon, SignOutIcon, MenuIcon } from './icons';

import Drawer from '@mui/material/Drawer';
import { Menu } from './Menu';

export default function Navigation() {
  const { hasGroup, isAuthenticated, setIsAuthenticated } = useAuthGroups();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <div className={`${isHome && 'fixed'} w-full z-50`}>
        <AnnouncementBar />
        <nav className={`${isHome && styles.nav} py-2 px-5 flex gap-4 items-center bg-red-700 shadow-sm relative z-50`}>
          <div className="font-bold text-xl text-gray-800">
            <Link to="/">
              <img src={logo} width={120} alt="Logo" />
            </Link>
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
            {Menu.map(item => (
              (!item.auth || isAuthenticated) && (!item.group || hasGroup(item.group)) &&
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex no-underline px-4 py-2 rounded transition-colors text-white ${isActive(item.path)
                  ? `${styles.linkActive}`
                  : 'hover:underline'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Información de usuario y acciones - Desktop */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="p-2 text-white hover:text-red-200 hover:bg-red-800 rounded transition-colors flex items-center gap-2 cursor-pointer"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <SignOutIcon />
                <span className="text-sm font-medium">Salir</span>
              </button>
            ) : (
              <Link
                to="/profile"
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
        <Drawer open={isMobileMenuOpen}>
          <Sidebar
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            Menu={Menu}
            hasGroup={hasGroup}
            isAuthenticated={isAuthenticated}
          />
        </Drawer>
      </div>
    </>
  );
}
