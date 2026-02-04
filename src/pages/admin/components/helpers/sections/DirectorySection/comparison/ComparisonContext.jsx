// src/pages/admin/components/helpers/sections/DirectorySection/comparison/ComparisonContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // 1. Cargar del LocalStorage al montar
    useEffect(() => {
        try {
            const stored = localStorage.getItem('directory_comparison_list');
            if (stored) setSelectedItems(JSON.parse(stored));
        } catch (e) {
            console.error("Error cargando comparaciones", e);
        }
    }, []);

    // 2. Guardar en LocalStorage al cambiar
    useEffect(() => {
        localStorage.setItem('directory_comparison_list', JSON.stringify(selectedItems));
    }, [selectedItems]);

    // 3. Toggle: Añadir o Quitar
    const toggleItem = (item) => {
        // Usamos item.id o item._id o generamos una firma única
        const itemId = item.id || item._id || JSON.stringify(item);
        const exists = selectedItems.find(i => (i.id || i._id || JSON.stringify(i)) === itemId);

        if (exists) {
            setSelectedItems(prev => prev.filter(i => (i.id || i._id || JSON.stringify(i)) !== itemId));
            setNotification({ open: true, message: 'Eliminado de la comparación', severity: 'info' });
        } else {
            if (selectedItems.length >= 4) {
                setNotification({ open: true, message: 'Máximo 4 elementos para comparar. Elimina uno primero.', severity: 'warning' });
                return;
            }
            setSelectedItems(prev => [...prev, item]);
            setNotification({ open: true, message: 'Añadido para comparar', severity: 'success' });
        }
    };

    const removeItem = (index) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    const clearComparison = () => setSelectedItems([]);

    return (
        <ComparisonContext.Provider value={{
            selectedItems,
            toggleItem,
            removeItem,
            clearComparison,
            isModalOpen,
            setIsModalOpen
        }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={2000}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </ComparisonContext.Provider>
    );
};