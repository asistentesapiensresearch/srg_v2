// src/view/sections/GroupSection/index.jsx
import { Box } from '@mui/material';
import PageRenderer from '../../../builder/Renderer';

export default function GroupSection({ background_color, padding_y, padding_x, children = [] }) {
    return (
        <Box sx={{ bgcolor: background_color, py: `${padding_y}px`, px: `${padding_x}px`, width: '100%' }} >
            {children.length > 0 ? (
                // 🔥 RECURSIVIDAD: Pinta los hijos del grupo
                <PageRenderer sections={children} />
            ) : (
                <Box sx={{ border: '1px dashed #ccc', p: 4, textAlign: 'center', color: '#999' }}>
                    Contenedor vacío. Añade elementos desde las capas.
                </Box>
            )}
        </Box>
    );
}