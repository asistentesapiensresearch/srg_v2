import { SECTION_SCHEMAS } from './sectionRegistry';
import { Box, Typography, IconButton, Collapse, TextField } from '@mui/material';
import {
    Type as TypeIcon,
    Image as ImageIcon,
    LayoutTemplate as FrameIcon,
    Trash2 as TrashIcon,
    ChevronRight,
    ChevronDown,
    Plus as PlusIcon,
    GripVertical,
    Pencil
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
    isSelected,
    onClick,
    onDelete,
    onAddChild,
    onRename,
    label,
    attributes,
    listeners,
    depth = 0,
    children,
    isDragging = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(section.customName || label);
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

    const startEditing = (e) => {
        e.stopPropagation();
        setDraftName(section.customName || label);
        setIsEditing(true);
    };

    const finishEditing = () => {
        onRename(section.id, draftName);
        setIsEditing(false);
    };

    return (
      <>
        <Box
          ref={setDroppableRef} // 🔥 Siempre aplicar ref para drop
          onClick={onClick}
          {...attributes}
          {...listeners}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 8px",
            pl: `${depth * 14 + 8}px`,
            my: 0.15,
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            position: "relative",
            bgcolor: isSelected
              ? "#fef2f2"
              : isOverDroppable && isContainer
                ? "rgba(76, 175, 80, 0.1)" // Verde cuando está sobre un contenedor
                : isOverDroppable && !isContainer
                  ? "rgba(33, 150, 243, 0.05)" // Azul claro sobre elementos normales
                  : "transparent",
            border: isSelected
              ? "1px solid transparent"
              : isOverDroppable && isContainer
                ? "2px dashed #4caf50" // Borde punteado verde para contenedores
                : isOverDroppable && !isContainer
                  ? "2px dashed #2196f3" // Borde punteado azul para elementos
                  : "1px solid transparent",
            borderLeft: isSelected ? "3px solid #c10007" : "3px solid transparent",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: isSelected
                ? "#fef2f2"
                : "#f8fafc",
              "& .actions-group": { opacity: 1 },
            },
            opacity: isDragging ? 0.4 : 1,
            transform: isDragging ? "scale(1.02)" : "scale(1)",
          }}
        >
          {/* IZQUIERDA: Grip + Flecha + Icono + Nombre */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflow: "hidden",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Grip handle para drag */}
            <Box
              sx={{
                color: "#999",
                display: "flex",
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                visibility: isContainer || hasChildren ? "visible" : "hidden",
              }}
            >
              {isExpanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </Box>

            {/* Icono del tipo */}
            <Box
              sx={{
                color: isSelected ? "#c10007" : "#64748b",
                display: "flex",
                bgcolor: "transparent",
                borderRadius: "4px",
                padding: "2px",
              }}
            >
              {getIconForType(section.type)}
            </Box>

            {/* Nombre */}
            {isEditing ? (
              <TextField
                autoFocus
                size="small"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={finishEditing}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                inputProps={{ maxLength: 80, "aria-label": "Nombre de la sección" }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  "& .MuiInputBase-input": {
                    py: 0.4,
                    px: 0.75,
                    fontSize: "13px",
                  },
                }}
              />
            ) : (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 500,
                    color: "#1e293b",
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    lineHeight: 1.25,
                  }}
                >
                  {section.customName || label}
                </Typography>
                {section.customName && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.2, fontSize: "10px", color: "#94a3b8", lineHeight: 1.2 }}
                  >
                    {label}
                  </Typography>
                )}
              </Box>
            )}

            {/* Badge de contenedor */}
            {isContainer && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "9px",
                  bgcolor: "transparent",
                  color: "#94a3b8",
                  px: 0.5,
                  py: 0.25,
                  borderRadius: "3px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {hasChildren ? `${section.children.length}` : "vacío"}
              </Typography>
            )}
          </Box>

          {/* DERECHA: Acciones */}
          <Box
            className="actions-group"
            sx={{
              display: "flex",
              gap: 0.5,
              opacity: isSelected || isEditing ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            <IconButton
              size="small"
              onClick={startEditing}
              onPointerDown={(e) => e.stopPropagation()}
              sx={{
                padding: "2px",
                color: "#64748b",
                "&:hover": { color: "#1976d2", bgcolor: "rgba(25, 118, 210, 0.08)" },
              }}
              title="Cambiar nombre"
            >
              <Pencil size={13} />
            </IconButton>

            {/* Botón Añadir Hijo (Solo para contenedores) */}
            {isContainer && (
              <IconButton
                size="small"
                onClick={(e) => onAddChild(e, section.id)}
                sx={{
                  padding: "2px",
                  color: "#4caf50",
                  "&:hover": { bgcolor: "rgba(76, 175, 80, 0.1)" },
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
                padding: "2px",
                "&:hover": { color: "red", bgcolor: "rgba(244, 67, 54, 0.1)" },
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
                position: "absolute",
                top: isContainer ? 0 : "50%",
                left: 0,
                right: 0,
                bottom: isContainer ? 0 : "auto",
                height: isContainer ? "auto" : "2px",
                bgcolor: isContainer ? "transparent" : "#2196f3",
                border: isContainer ? "2px solid #4caf50" : "none",
                borderRadius: isContainer ? "4px" : 0,
                pointerEvents: "none",
                animation: isContainer
                  ? "pulse 1.5s ease-in-out infinite"
                  : "none",
                transform: isContainer ? "none" : "translateY(-50%)",
                zIndex: 10,
              }}
            />
          )}
        </Box>

        {/* RENDERIZADO DE HIJOS EN EL ÁRBOL */}
        {(isContainer || hasChildren) && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {/* Indicador de zona de drop cuando está vacío */}
            {isContainer &&
              (!hasChildren || section.children.length === 0) &&
              isOverDroppable && (
                <Box
                  sx={{
                    ml: `${(depth + 1) * 16 + 8}px`,
                    p: 2,
                    border: "2px dashed #4caf50",
                    borderRadius: 1,
                    bgcolor: "rgba(76, 175, 80, 0.05)",
                    textAlign: "center",
                    my: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="success.main"
                    fontWeight={600}
                  >
                    ⬇️ Suelta aquí
                  </Typography>
                </Box>
              )}
            {children}
          </Collapse>
        )}
      </>
    );
};
