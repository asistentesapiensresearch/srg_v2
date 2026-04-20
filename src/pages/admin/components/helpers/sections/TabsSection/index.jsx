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
            <Box sx={{ borderBottom: { xs: 0, sm: 1 }, borderColor: 'divider', display: 'flex', justifyContent: alignment }}>
                <Tabs
                    value={activeTab}
                    onChange={handleChange}
                    variant={variant}
                    TabIndicatorProps={{
                        sx: {
                            backgroundColor: indicator_color,
                            display: { xs: 'none', sm: 'block' }
                        }
                    }}
                    sx={{
                        width: '100%',
                        '& .MuiTabs-scroller': {
                            overflow: { xs: 'hidden !important', sm: 'hidden !important' } // Use hidden for xs, but flex-wrap handles children
                        },
                        '& .MuiTabs-flexContainer': {
                            flexWrap: { xs: 'wrap', sm: 'nowrap' }
                        },
                        '& .MuiTab-root': {
                            color: tabs_color,
                            flexBasis: { xs: '50%', sm: 'auto' },
                            maxWidth: { xs: '50%', sm: 'none' },
                            boxSizing: 'border-box',
                            borderBottom: { xs: 2, sm: 0 },
                            borderColor: { xs: 'transparent', sm: 'transparent' }
                        },
                        '& .Mui-selected': {
                            color: indicator_color,
                            fontWeight: 'bold',
                            borderBottomColor: { xs: indicator_color, sm: 'transparent' }
                        },
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