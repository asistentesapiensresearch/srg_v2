import styles from './Navigation.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuthGroups } from '../hooks/useAuthGroups';
import { signOut } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';

import logo from '../assets/images/logo.png';
import { AnnouncementBar } from '../widgets/AnnouncementBar';
import Sidebar from './Sidebar';

import { SignInIcon, SignOutIcon, MenuIcon } from './icons';

import Drawer from '@mui/material/Drawer';
import { Menu } from './Menu';

// Hook personalizado para detectar si es mobile
import { useIsMobile } from '../hooks/useIsMobile';

export default function Navigation() {
  const { hasGroup, isAuthenticated, setIsAuthenticated } = useAuthGroups();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMobile = useIsMobile(768); // <768px = móvil

  // Si cambio de móvil → desktop, cierro el menú automáticamente
  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

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

          {/* Logo */}
          <div className="font-bold text-xl text-gray-800">
            <Link to="/">
              <img src={logo} width={120} alt="Logo" />
            </Link>
          </div>

          {/* 🔹 Botón hamburguesa — solo móvil */}
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="ml-auto text-white p-2 hover:bg-red-800 rounded transition-colors"
              aria-label="Abrir menú"
            >
              <MenuIcon />
            </button>
          )}

          {/* 🔹 Menú desktop */}
          {!isMobile && (
            <div className="flex gap-4 ml-auto">
              {Menu.map(item => (
                (!item.auth || isAuthenticated) &&
                (!item.group || hasGroup(item.group)) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex no-underline px-4 py-2 rounded transition-colors text-white 
                      ${isActive(item.path) ? styles.linkActive : 'hover:underline'}
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          )}

          {/* 🔹 Acciones de usuario — desktop */}
          {!isMobile && (
            <div className="flex items-center">
              {isAuthenticated ? (
                <button
                  onClick={handleSignOut}
                  className="p-2 text-white hover:text-red-200 hover:bg-red-800 rounded transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <SignOutIcon />
                  <span className="text-sm font-medium">Salir</span>
                </button>
              ) : (
                <Link
                  to="/profile"
                  className="ml-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors flex items-center gap-2"
                >
                  <SignInIcon />
                  <span className="text-sm font-medium">Ingresar</span>
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* 🔹 Menu móvil con Drawer */}
        <Drawer open={isMobileMenuOpen && isMobile}>
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