// src/components/builder/Renderer.jsx
import { SECTION_REGISTRY } from './sectionRegistry';
import { Box, Typography } from '@mui/material';

const PageRenderer = ({ sections }) => {
    if (!sections || sections.length === 0) {
        return <Box p={4}>Agrega una sección para comenzar</Box>;
    }

    return (
        <Box className="w-full">
            {sections.map((section) => {
                // Buscamos el componente en el registro por su "type"
                const Component = SECTION_REGISTRY[section.type];

                if (!Component) {
                    return <Typography color="error">Componente {section.type} no encontrado</Typography>;
                }

                // Renderizamos pasando las props guardadas
                return <Component key={section.id} {...section.props} />;
            })}
        </Box>
    );
};

export default PageRenderer;