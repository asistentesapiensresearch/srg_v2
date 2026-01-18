// src/components/builder/LayerItem.jsx
import { SECTION_SCHEMAS } from './sectionRegistry';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import {
    Type as TypeIcon,
    Image as ImageIcon,
    LayoutTemplate as FrameIcon,
    Trash2 as TrashIcon,
    ChevronRight,
    ChevronDown,
    Plus as PlusIcon
} from 'lucide-react';
import { useState } from 'react';

// ... (getIconForType se mantiene igual)
const getIconForType = (type) => {
    switch (type) {
        case 'FeaturesGrid': return <FrameIcon size={16} />; // Icono específico para Grid
        case 'hero': return <FrameIcon size={16} />;
        case 'text': return <TypeIcon size={16} />;
        case 'image': return <ImageIcon size={16} />;
        default: return <FrameIcon size={16} />;
    }
};

export const LayerItem = ({
    section,
    isActive,
    isSelected,
    onClick,
    onDelete,
    onAddChild, // <--- Nueva prop para añadir hijos
    label,
    attributes,
    listeners,
    depth = 0, // <--- Nivel de profundidad
    children // Los componentes hijos (visuales) del TreeView
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = section.children && section.children.length > 0;
    const schema = SECTION_SCHEMAS[section.type];
    const isContainer = schema?.isContainer === true;

    const handleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <Box
                onClick={onClick}
                // Solo aplicamos drag listeners al área principal, no a los hijos renderizados fuera
                {...attributes}
                {...listeners}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    pl: `${depth * 16 + 8}px`, // 🔥 Indentación dinámica estilo Figma
                    cursor: 'default',
                    userSelect: 'none',
                    bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    border: isSelected ? '1px solid #1976d2' : '1px solid transparent',
                    '&:hover': {
                        bgcolor: isSelected ? 'rgba(25, 118, 210, 0.12)' : '#f5f5f5',
                        '& .actions-group': { opacity: 1 }
                    },
                    opacity: isActive ? 0.5 : 1,
                }}
            >
                {/* IZQUIERDA: Flecha + Icono + Nombre */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>

                    {/* Botón de colapsar (solo si es contenedor) */}
                    <Box
                        onClick={handleExpand}
                        sx={{
                            width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', visibility: isContainer ? 'visible' : 'hidden'
                        }}
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </Box>

                    <Box sx={{ color: isSelected ? '#1976d2' : '#5f6368', display: 'flex' }}>
                        {getIconForType(section.type)}
                    </Box>

                    <Typography
                        variant="body2"
                        noWrap
                        sx={{ fontSize: '13px', fontWeight: isSelected ? 500 : 400, color: '#333' }}
                    >
                        {label}
                    </Typography>
                </Box>

                {/* DERECHA: Acciones */}
                <Box className="actions-group" sx={{ display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.2s' }}>
                    {/* Botón Añadir Hijo (Solo para contenedores) */}
                    {isContainer && (
                        <IconButton size="small" onClick={(e) => onAddChild(e, section.id)} sx={{ padding: '2px' }}>
                            <PlusIcon size={14} />
                        </IconButton>
                    )}

                    <IconButton size="small" onClick={(e) => onDelete(e, section.id)} sx={{ padding: '2px', '&:hover': { color: 'red' } }}>
                        <TrashIcon size={14} />
                    </IconButton>
                </Box>
            </Box>

            {/* RENDERIZADO DE HIJOS EN EL ÁRBOL */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    );
};