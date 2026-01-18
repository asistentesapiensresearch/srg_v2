import { useState } from "react";
import { AppBar, Avatar, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip } from "@mui/material"
import { Bell, LogOut, MenuIcon, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import logo from '@src/assets/images/logo-black.png'
import { signOut } from "aws-amplify/auth";

export const Navbar = ({
    theme,
    open,
    setOpen
}) => {
    const [anchorElUser, setAnchorElUser] = useState(null); // Estado para el menú de usuario
    const navigate = useNavigate();

    // Abre/Cierra el sidebar
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    // Abre el menú de usuario
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // Cierra el menú de usuario
    const handleCloseUserMenu = (logout = false) => {
        if(logout){
            signOut().then(() => {
                window.location.href = window.location.origin;
            });
            // window.location.reload();
        }
        setAnchorElUser(null);
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: theme.zIndex.drawer + 1, // Por encima del sidebar
                backgroundColor: '#ffffff',
                color: theme.palette.text.primary,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
        >
            <Toolbar>
                {/* Botón de Hamburguesa */}
                <IconButton
                    color="inherit"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{ marginRight: 2 }}
                >
                    <MenuIcon size={22} />
                </IconButton>
                <Link>
                    <img src={logo} alt='Sapiens Research' width={100} />
                </Link>

                {/* Espaciador (empuja íconos a la derecha) */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Íconos de la derecha (Notificaciones y Usuario) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 1 }}>

                    {/* Botón de Notificaciones */}
                    <Tooltip title="Notificaciones">
                        <IconButton sx={{
                            bgcolor: theme.palette.grey[100], // Fondo gris claro
                            borderRadius: '12px', // Estilo Chip
                            color: theme.palette.text.secondary
                        }}>
                            <Bell size={20} />
                        </IconButton>
                    </Tooltip>

                    {/* Botón de Usuario */}
                    <Tooltip title="Configuración de Usuario">
                        <IconButton
                            onClick={handleOpenUserMenu} // Abre el menú
                            sx={{
                                bgcolor: theme.palette.grey[100], // Fondo gris claro
                                borderRadius: '12px', // Estilo Chip
                                padding: '4px' // Ajuste para el Avatar
                            }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                                <User size={16} />
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Menú Desplegable de Usuario */}
                <Menu
                    sx={{ mt: '45px' }} // Baja el menú
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={() => handleCloseUserMenu(true)}>
                        <ListItemIcon>
                            <LogOut size={18} style={{ marginRight: 8 }} />
                        </ListItemIcon>
                        <ListItemText>Cerrar sesión</ListItemText>
                    </MenuItem>
                    {/* Aquí puedes agregar más MenuItem... */}
                </Menu>

            </Toolbar>
        </AppBar>
    )
}