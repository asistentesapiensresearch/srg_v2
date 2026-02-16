import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';

// Assets & Icons
import logo from '../../assets/images/logo.png';
import { SignInIcon, SignOutIcon, MenuIcon } from '../icons';

// Components & Hooks
import Sidebar from '../sidebar';
import { useAuthGroups } from '../../hooks/useAuthGroups';
import { AnnouncementBar } from '../../widgets/AnnouncementBar';
import { Menu } from '../menu';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function Navigation() {
  const { hasGroup, isAuthenticated, setIsAuthenticated } = useAuthGroups();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isMobile = useIsMobile(768);

  // Detectar scroll para cambiar estilos (efecto visual moderno)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar a desktop
  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

  // Cerrar menú al cambiar de ruta (UX: el usuario ya eligió a dónde ir)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isHome = location.pathname === '/';

  // Clases dinámicas para el header
  const headerClasses = `
    w-full z-50 transition-all duration-300 ease-in-out
    ${isHome ? 'fixed top-0' : 'sticky top-0'}
    ${isScrolled || !isHome ? 'bg-red-700 shadow-md py-2' : 'bg-transparent py-4'}
  `;

  return (
    <>
      {/* Barra de anuncios (Generalmente va arriba del header y no fija, o fija junto con él) */}
      {!isHome && <AnnouncementBar />}

      <header className={headerClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16">

            {/* --- LOGO --- */}
            <div className="flex-shrink-0 cursor-pointer">
              <Link to="/" aria-label="Ir al inicio">
                <img
                  src={logo}
                  alt="Logo Corporativo"
                  className="h-10 w-auto md:h-12 transition-transform hover:scale-105" // Altura controlada, ancho automático
                />
              </Link>
            </div>

            {/* --- MENÚ DESKTOP --- */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-6">
                {Menu.map((item) => {
                  if (item.auth && !isAuthenticated) return null;
                  if (item.group && !hasGroup(item.group)) return null;

                  const active = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      aria-current={active ? 'page' : undefined}
                      className={`
                        group flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                        ${active
                          ? 'bg-red-800 text-white shadow-inner'
                          : 'text-red-100 hover:bg-red-600 hover:text-white'}
                      `}
                    >
                      {/* Icono con opacidad variable */}
                      <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* --- ACCIONES DERECHA (Auth & Mobile Toggle) --- */}
            <div className="flex items-center gap-3">

              {/* Desktop Auth Buttons */}
              {!isMobile && (
                <>
                  {isAuthenticated ? (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-800/50 hover:bg-red-900 rounded-full transition-colors border border-red-600"
                    >
                      <SignOutIcon className="w-4 h-4" />
                      Salir
                    </button>
                  ) : (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                      <SignInIcon className="w-4 h-4" />
                      Ingresar
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Hamburger Button */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-white hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Abrir menú principal"
                  aria-expanded={isMobileMenuOpen}
                >
                  <MenuIcon className="w-7 h-7" />
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* --- DRAWER MÓVIL --- */}
      <Drawer
        anchor="right" // "right" es más estándar para menús móviles modernos
        open={isMobileMenuOpen && isMobile}
        onClose={() => setIsMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: '80%', maxWidth: '300px' } // Controlar ancho del drawer
        }}
      >
        <Sidebar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          Menu={Menu}
          hasGroup={hasGroup}
          isAuthenticated={isAuthenticated}
        />
      </Drawer>
    </>
  );
}