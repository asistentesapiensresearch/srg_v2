import styles from './Sidebar.module.css';
import logo from '../assets/images/logo-black.png'
import { Link } from 'react-router-dom';
import { useAuthGroups } from '../hooks/useAuthGroups';

import { SignInIcon, CloseIcon } from './icons';

const classActive = 'bg-red-700 text-white';
const classInactive = 'hover:undeline';

const Sidebar = ({
    setIsMobileMenuOpen
}) => {
    const { groups, hasGroup, isAuthenticated } = useAuthGroups();

    const isActive = (path) => location.pathname === path;

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Overlay oscuro */}
            <div
                className={`fixed inset-0 ${styles.bg}`}
                onClick={closeMobileMenu}
            ></div>

            {/* Menú lateral */}
            <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform">
                <div className="flex flex-col h-full p-4">
                    {/* Header del menú móvil */}
                    <div className="flex justify-between items-center mb-6">
                        <img src={logo} width={100} alt="Logo" />
                        <button
                            onClick={closeMobileMenu}
                            className="text-white p-2 hover:bg-red-600 rounded"
                            aria-label="Cerrar menú"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Enlaces del menú móvil */}
                    <div className="flex flex-col gap-2 flex-1">
                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className={`px-4 py-3 rounded transition-colors ${isActive('/')? classActive : classInactive}`}
                        >
                            Inicio
                        </Link>

                        <Link
                            to="/about"
                            onClick={closeMobileMenu}
                            className={`px-4 py-3 rounded transition-colors ${isActive('/about')? classActive : classInactive}`}
                        >
                            Nosotros
                        </Link>

                        {hasGroup('Allies') && (
                            <Link
                                to="/allies"
                                onClick={closeMobileMenu}
                                className={`px-4 py-3 rounded transition-colors ${isActive('/allies')? classActive : classInactive}`}
                            >
                                Aliados
                            </Link>
                        )}

                        {hasGroup('Admin') && (
                            <Link
                                to="/admin"
                                onClick={closeMobileMenu}
                                className={`px-4 py-3 rounded transition-colors ${isActive('/admin')? classActive : classInactive}`}
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Footer del menú móvil con info de usuario */}
                    <div className="border-t border-red-700 pt-4 mt-4">
                        {isAuthenticated ? (
                            <>
                                <div className="text-sm text-gray-300 mb-4">
                                    Grupos: <span className="font-medium">{groups.join(', ').replace('Viewer', 'Invitado') || 'Ninguno'}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded transition-colors flex items-center justify-center gap-2"
                                >
                                    <SignOutIcon />
                                    <span>Cerrar sesión</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin"
                                onClick={closeMobileMenu}
                                className="w-full px-4 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors flex items-center justify-center gap-2"
                            >
                                <SignInIcon />
                                <span>Ingresar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;