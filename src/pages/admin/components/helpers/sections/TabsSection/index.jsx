import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import PageRenderer from '../../../builder/Renderer';

export default function TabsSection({
    background_color,
    tabs_color,
    indicator_color,
    alignment,
    variant,
    children = []
}) {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ bgcolor: background_color, width: '100%' }}>
            {/* Cabecera de Pestañas */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: alignment }}>
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    variant={variant}
                    TabIndicatorProps={{
                        style: { backgroundColor: indicator_color }
                    }}
                    sx={{
                        '& .MuiTab-root': { color: tabs_color },
                        '& .Mui-selected': { color: indicator_color, fontWeight: 'bold' },
                    }}
                >
                    {children.length > 0 ? (
                        children.map((child, index) => (
                            <Tab
                                key={child.id}
                                // 🔥 IMPORTANTE: Buscamos la prop "label" del hijo para el nombre
                                label={child.props?.label || child.props?.title || `Tab ${index + 1}`}
                            />
                        ))
                    ) : (
                        <Tab label="Vacío" />
                    )}
                </Tabs>
            </Box>

            {/* Contenido de los Paneles */}
            <Box sx={{ minHeight: '150px' }}>
                {children && children.length > 0 ? (
                    children.map((child, index) => (
                        <Box
                            key={child.id}
                            role="tabpanel"
                            hidden={activeTab !== index}
                        >
                            {activeTab === index && (
                                // 🔥 RECURSIVIDAD: Renderizamos el componente hijo
                                <PageRenderer sections={[child]} />
                            )}
                        </Box>
                    ))
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed #ccc', m: 2, borderRadius: 2, color: '#999' }}>
                        Añade componentes dentro para crear pestañas (Ej: DirectorySection, Features, etc.)
                    </Box>
                )}
            </Box>
        </Box>
    );
}