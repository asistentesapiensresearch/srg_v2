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
    Plus as PlusIcon,
    GripVertical
} from 'lucide-react';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

const getIconForType = (type) => {
    switch (type) {
        case 'FeaturesGrid': return <FrameIcon size={16} />;
        case 'hero': return <FrameIcon size={16} />;
        case 'text': return <TypeIcon size={16} />;
        case 'image': 
        case 'ImageSection': return <ImageIcon size={16} />;
        default: return <FrameIcon size={16} />;
    }
};

export const LayerItem = ({
    section,
    isActive,
    isSelected,
    onClick,
    onDelete,
    onAddChild,
    label,
    attributes,
    listeners,
    depth = 0,
    children,
    isDragging = false,
    isOver = false
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = section.children && section.children.length > 0;
    const schema = SECTION_SCHEMAS[section.type];
    const isContainer = schema?.isContainer === true;

    // 🔥 Configurar como droppable (todos los elementos pueden recibir drops)
    const { setNodeRef: setDroppableRef, isOver: isOverDroppable } = useDroppable({
        id: section.id,
        disabled: false, // Permitir drop en todos los elementos
        data: {
            type: isContainer ? 'container' : 'element',
            accepts: ['section']
        }
    });

    const handleExpand = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <Box
                ref={setDroppableRef} // 🔥 Siempre aplicar ref para drop
                onClick={onClick}
                {...attributes}
                {...listeners}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    pl: `${depth * 16 + 8}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    position: 'relative',
                    bgcolor: isSelected 
                        ? 'rgba(25, 118, 210, 0.08)' 
                        : isOverDroppable && isContainer
                        ? 'rgba(76, 175, 80, 0.1)' // Verde cuando está sobre un contenedor
                        : isOverDroppable && !isContainer
                        ? 'rgba(33, 150, 243, 0.05)' // Azul claro sobre elementos normales
                        : 'transparent',
                    border: isSelected 
                        ? '1px solid #1976d2' 
                        : isOverDroppable && isContainer
                        ? '2px dashed #4caf50' // Borde punteado verde para contenedores
                        : isOverDroppable && !isContainer
                        ? '2px dashed #2196f3' // Borde punteado azul para elementos
                        : '1px solid transparent',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: isSelected 
                            ? 'rgba(25, 118, 210, 0.12)' 
                            : isContainer
                            ? 'rgba(76, 175, 80, 0.05)'
                            : '#f5f5f5',
                        '& .actions-group': { opacity: 1 }
                    },
                    opacity: isDragging ? 0.4 : 1,
                    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                }}
            >
                {/* IZQUIERDA: Grip + Flecha + Icono + Nombre */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                    
                    {/* Grip handle para drag */}
                    <Box 
                        sx={{ 
                            color: '#999', 
                            display: 'flex',
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' }
                        }}
                    >
                        <GripVertical size={12} />
                    </Box>

                    {/* Botón de colapsar (solo si es contenedor O tiene hijos) */}
                    <Box
                        onClick={handleExpand}
                        sx={{
                            width: 16, 
                            height: 16, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            cursor: 'pointer', 
                            visibility: (isContainer || hasChildren) ? 'visible' : 'hidden'
                        }}
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </Box>

                    {/* Icono del tipo */}
                    <Box sx={{ 
                        color: isSelected ? '#1976d2' : '#5f6368', 
                        display: 'flex',
                        bgcolor: isContainer ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                        borderRadius: '4px',
                        padding: '2px'
                    }}>
                        {getIconForType(section.type)}
                    </Box>

                    {/* Nombre */}
                    <Typography
                        variant="body2"
                        noWrap
                        sx={{ 
                            fontSize: '13px', 
                            fontWeight: isSelected ? 500 : 400, 
                            color: '#333',
                            maxWidth: '120px'
                        }}
                    >
                        {label}
                    </Typography>

                    {/* Badge de contenedor */}
                    {isContainer && (
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '9px',
                                bgcolor: 'rgba(33, 150, 243, 0.15)',
                                color: '#1976d2',
                                px: 0.5,
                                py: 0.25,
                                borderRadius: '3px',
                                fontWeight: 600,
                                textTransform: 'uppercase'
                            }}
                        >
                            {hasChildren ? `${section.children.length}` : 'vacío'}
                        </Typography>
                    )}
                </Box>

                {/* DERECHA: Acciones */}
                <Box className="actions-group" sx={{ display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.2s' }}>
                    {/* Botón Añadir Hijo (Solo para contenedores) */}
                    {isContainer && (
                        <IconButton 
                            size="small" 
                            onClick={(e) => onAddChild(e, section.id)} 
                            sx={{ 
                                padding: '2px',
                                color: '#4caf50',
                                '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' }
                            }}
                            title="Añadir hijo"
                        >
                            <PlusIcon size={14} />
                        </IconButton>
                    )}

                    {/* Botón Eliminar */}
                    <IconButton 
                        size="small" 
                        onClick={(e) => onDelete(e, section.id)} 
                        sx={{ 
                            padding: '2px', 
                            '&:hover': { color: 'red', bgcolor: 'rgba(244, 67, 54, 0.1)' } 
                        }}
                        title="Eliminar"
                    >
                        <TrashIcon size={14} />
                    </IconButton>
                </Box>

                {/* Indicador visual cuando está sobre el elemento */}
                {isOverDroppable && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: isContainer ? 0 : '50%',
                            left: 0,
                            right: 0,
                            bottom: isContainer ? 0 : 'auto',
                            height: isContainer ? 'auto' : '2px',
                            bgcolor: isContainer ? 'transparent' : '#2196f3',
                            border: isContainer ? '2px solid #4caf50' : 'none',
                            borderRadius: isContainer ? '4px' : 0,
                            pointerEvents: 'none',
                            animation: isContainer ? 'pulse 1.5s ease-in-out infinite' : 'none',
                            transform: isContainer ? 'none' : 'translateY(-50%)',
                            zIndex: 10
                        }}
                    />
                )}
            </Box>

            {/* RENDERIZADO DE HIJOS EN EL ÁRBOL */}
            {(isContainer || hasChildren) && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {/* Indicador de zona de drop cuando está vacío */}
                    {isContainer && (!hasChildren || section.children.length === 0) && isOverDroppable && (
                        <Box
                            sx={{
                                ml: `${(depth + 1) * 16 + 8}px`,
                                p: 2,
                                border: '2px dashed #4caf50',
                                borderRadius: 1,
                                bgcolor: 'rgba(76, 175, 80, 0.05)',
                                textAlign: 'center',
                                my: 1
                            }}
                        >
                            <Typography variant="caption" color="success.main" fontWeight={600}>
                                ⬇️ Suelta aquí
                            </Typography>
                        </Box>
                    )}
                    {children}
                </Collapse>
            )}

            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </>
    );
};