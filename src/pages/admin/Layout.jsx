import React, { useState } from 'react';
import {
    Box,
    Toolbar,
    CssBaseline,
    useTheme
} from '@mui/material';

import { Navbar } from './layout/Navbar';
import { Sidebar } from './layout/Sidebar';
import { Outlet } from 'react-router-dom';

/**
 * Componente principal del Layout Administrativo
 */
const Layout = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(true); // Estado para controlar el sidebar

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Navbar theme={theme} open={open} setOpen={setOpen} />

            <Sidebar theme={theme} open={open} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1, // Ocupa el espacio restante
                    minHeight: '100vh', // Alto completo
                }}
            >
                {/* Espaciador para que el contenido no quede debajo del AppBar */}
                <Toolbar />
                <Box sx={{
                    bgcolor: '#f6eeee',
                    p: 3, // Padding,
                    borderRadius: 3,
                    minHeight: 'calc(100vh - 64px)', // Alto completo
                }}>
                    <Outlet/>
                </Box>
            </Box>
        </Box>
    );
}

export default Layout;