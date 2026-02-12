// src/pages/admin/components/helpers/sections/ModalSection/index.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Button, IconButton, Box, Typography, CircularProgress
} from '@mui/material';
import { X, ExternalLink } from 'lucide-react';

// Importación Lazy para evitar dependencia circular
const RecursiveRenderer = lazy(() => import('../../../builder/Renderer'));

export default function ModalSection({
    // Props de configuración
    editorMode = true,
    triggerType = "button",
    triggerSelector = "", // Ej: #mi-id o .mi-clase
    buttonText = "Abrir Modal",
    buttonVariant = "contained",
    autoDelay = 2,
    frequency = "always",
    modalSize = "md",
    title = "",
    id,

    // Props de datos
    children,
    research
}) {
    const [isOpen, setIsOpen] = useState(false);
    const storageKey = `modal_seen_${id}`;

    // Helper: Validar si debemos saltar la apertura automática
    const shouldSkipAutoOpen = () => {
        if (frequency === 'session' && sessionStorage.getItem(storageKey)) return true;
        if (frequency === 'day') {
            const lastSeen = localStorage.getItem(storageKey);
            // 86400000 ms = 24 horas
            if (lastSeen && (new Date().getTime() - parseInt(lastSeen) < 86400000)) return true;
        }
        return false;
    };

    // Helper: Marcar como visto
    const markAsSeen = () => {
        if (frequency === 'session') sessionStorage.setItem(storageKey, 'true');
        else if (frequency === 'day') localStorage.setItem(storageKey, new Date().getTime().toString());
    };

    // =========================================================
    // 🔥 LÓGICA DE ACTIVACIÓN (AQUÍ ESTABA EL FALTANTE) 🔥
    // =========================================================
    useEffect(() => {
        // 1. MODO EDITOR: Siempre abierto o cerrado según el toggle, ignora triggers
        if (editorMode) {
            setIsOpen(true);
            return;
        } else {
            setIsOpen(false);
        }

        // 2. ACTIVACIÓN POR SELECTOR (ID / CLASE)
        if (triggerType === 'selector' && triggerSelector) {
            const handleGlobalClick = (e) => {
                // Buscamos si el elemento clickeado coincide con el selector (o está dentro de uno que coincida)
                // Ej: si triggerSelector es "#mi-btn", esto detecta el click ahí.
                const target = e.target.closest(triggerSelector);

                if (target) {
                    e.preventDefault(); // Evita saltos si es un <a href="#">
                    setIsOpen(true);
                    markAsSeen();
                }
            };

            // Escuchamos en todo el documento (Event Delegation)
            document.addEventListener('click', handleGlobalClick);

            // Limpieza al desmontar
            return () => {
                document.removeEventListener('click', handleGlobalClick);
            };
        }

        // 3. ACTIVACIÓN AUTOMÁTICA
        if (triggerType === 'auto') {
            if (shouldSkipAutoOpen()) return;

            const timer = setTimeout(() => {
                setIsOpen(true);
                markAsSeen();
            }, (autoDelay || 0) * 1000);

            return () => clearTimeout(timer);
        }

    }, [triggerType, triggerSelector, autoDelay, frequency, editorMode, id]);

    // Helpers UI
    const handleClose = () => setIsOpen(false);

    return (
        <Box sx={{
            minHeight: triggerType !== 'button' ? '50px' : 'auto',
            border: editorMode && triggerType !== 'button' ? '1px dashed #ccc' : 'none',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            p: editorMode && triggerType !== 'button' ? 2 : 0
        }}>

            {/* BOTÓN PROPIO (Solo si triggerType es 'button') */}
            {triggerType === 'button' && (
                <Button variant={buttonVariant} onClick={() => setIsOpen(true)} size="large">
                    {buttonText || "Abrir Modal"}
                </Button>
            )}

            {/* INDICADOR EN MODO EDITOR (Si es por ID o Auto y está cerrado) */}
            {editorMode && !isOpen && (
                <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary" display="block">
                        [Modal Oculto]
                    </Typography>
                    {triggerType === 'selector' && (
                        <Typography variant="caption" fontWeight="bold" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                            <ExternalLink size={12} /> Escuchando: {triggerSelector || "Sin selector"}
                        </Typography>
                    )}
                </Box>
            )}

            {/* EL MODAL */}
            <Dialog
                open={isOpen}
                onClose={handleClose}
                maxWidth={modalSize === 'full' ? false : modalSize}
                fullScreen={modalSize === 'full'}
                fullWidth={modalSize !== 'full'}
                scroll="paper"
                disableEnforceFocus={editorMode}
                disablePortal={editorMode}
                sx={{ zIndex: editorMode ? 1300 : 1300 }}
            >
                {(title || editorMode) && (
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                        <Typography variant="h6" component="div" fontWeight="bold">
                            {title || (editorMode ? "Contenedor Modal" : "")}
                        </Typography>
                        <IconButton onClick={handleClose} size="small"><X size={20} /></IconButton>
                    </DialogTitle>
                )}
                {!title && !editorMode && (
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}><X size={20} /></IconButton>
                )}

                <DialogContent dividers={!!title} sx={{ p: 0, minHeight: 200, bgcolor: '#f9f9f9' }}>

                    {(!children || (Array.isArray(children) && children.length === 0)) ? (
                        editorMode && (
                            <Box p={4} textAlign="center" border="2px dashed #ccc" m={2} borderRadius={2}>
                                <Typography color="text.secondary">Arrastra secciones aquí dentro</Typography>
                            </Box>
                        )
                    ) : (
                        <Suspense fallback={<Box p={4} display="flex" justify="center"><CircularProgress /></Box>}>
                            <RecursiveRenderer
                                sections={children}
                                research={research}
                            />
                        </Suspense>
                    )}

                </DialogContent>
            </Dialog>
        </Box>
    );
}