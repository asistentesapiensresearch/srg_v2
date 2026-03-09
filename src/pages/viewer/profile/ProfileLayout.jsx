import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Typography, Divider, Button
} from '@mui/material';
import { User, Building2, LogOut } from 'lucide-react';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { Preloader } from '@src/components/preloader';

// Importar tu navegación existente
import Navigation from "@src/components/navigation";

const drawerWidth = 240;

export const ProfileLayout = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkGroups();
    }, []);

    const checkGroups = async () => {
        try {
            const session = await fetchAuthSession();
            const payload = session.tokens?.idToken?.payload;
            if (payload && payload['cognito:groups']) {
                setGroups(payload['cognito:groups']);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) return <Preloader />;

    const isAlly = groups.includes('Allies') || groups.includes('Admin');

    const menuItems = [
        { text: 'Mi Perfil', icon: <User size={20} />, path: '/profile' },
        ...(isAlly ? [{ text: 'Mis Instituciones', icon: <Building2 size={20} />, path: '/profile/institutions' }] : [])
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>

            {/* HEADER GLOBAL */}
            <Box sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Navigation />
            </Box>

            <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>

                {/* SIDEBAR */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            borderRight: '1px solid #e2e8f0',
                            position: 'relative',
                            height: '100%'
                        },
                    }}
                >
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" fontWeight="bold" className='text-red-700'>
                            Mi Cuenta
                        </Typography>
                    </Box>
                    <Divider />

                    <List sx={{ p: 2 }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    end
                                    sx={{
                                        borderRadius: 2,
                                        color: '#64748b', // Color por defecto (gris)
                                        // 🔥 ESTILOS DEL ESTADO ACTIVO
                                        '&.active': {
                                            bgcolor: '#c10008', // bg-red-700
                                            color: 'white',
                                            '& .MuiListItemIcon-root': {
                                                color: 'white'
                                            },
                                            '&:hover': {
                                                bgcolor: '#991b1b', // un rojo un poco más oscuro al hacer hover activo
                                            }
                                        },
                                        // Hover normal (inactivo)
                                        '&:hover': {
                                            bgcolor: '#fee2e2', // bg-red-50
                                            color: '#c10008',
                                            '& .MuiListItemIcon-root': {
                                                color: '#c10008'
                                            }
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ mt: 'auto', p: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<LogOut size={18} />}
                            onClick={handleSignOut}
                            sx={{
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                                color: '#64748b',
                                '&:hover': {
                                    borderColor: '#ef4444',
                                    bgcolor: '#fef2f2',
                                    color: '#ef4444'
                                }
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Box>
                </Drawer>

                {/* CONTENIDO PRINCIPAL */}
                <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};