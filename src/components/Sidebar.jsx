import styles from './Sidebar.module.css';
import logo from '../assets/images/logo-black.png'
import { Link } from 'react-router-dom';
import { useAuthGroups } from '../hooks/useAuthGroups';

import { SignInIcon, CloseIcon, SignOutIcon } from './icons';
import { signOut } from 'aws-amplify/auth';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

const classActive = 'bg-red-700 text-white';
const classInactive = 'hover:undeline';

const Sidebar = ({
    setIsMobileMenuOpen,
    Menu,
    hasGroup,
    isAuthenticated
}) => {

    const isActive = (path) => location.pathname === path;

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
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
                <div className="flex flex-col h-full">
                    {/* Header del menú móvil */}
                    <div className="flex justify-between items-center p-4">
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
                    <div className="flex flex-col flex-1">
                        {Menu.map(item => (
                            item.allow && (!item.group || hasGroup(item.group)) &&
                            <>
                                <Divider />
                                <List style={{ padding: 0 }}>
                                    <Link
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className={`block px-4 py-3 rounded transition-colors ${isActive(item.path) ? classActive : classInactive}`}
                                    >{item.label}</Link>
                                </List>
                            </>
                        ))}
                    </div>

                    {/* Footer del menú móvil con info de usuario */}
                    <div className="border-t border-red-700 pt-4 mt-4">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full px-4 py-3 bg-red-700 text-white hover:bg-red-700 rounded transition-colors flex items-center justify-center gap-2"
                                >
                                    <SignOutIcon />
                                    <span>Cerrar sesión</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin"
                                onClick={closeMobileMenu}
                                className="w-full px-4 py-3 bg-blue-700 text-white hover:bg-blue-600 rounded transition-colors flex items-center justify-center gap-2"
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