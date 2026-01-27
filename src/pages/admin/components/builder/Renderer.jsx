// src/components/builder/Renderer.jsx
import { SECTION_REGISTRY } from './sectionRegistry';
import { Box, Typography } from '@mui/material';

const PageRenderer = ({ sections, research }) => {
    if (!sections || sections.length === 0) {
        return <Box p={4}>Agrega una sección para comenzar</Box>;
    }

    return (
        <Box className="w-full">
            {sections.map((section) => {
                const Component = SECTION_REGISTRY[section.type];

                if (!Component) {
                    return (
                        <Typography
                            key={section.id}
                            color="error"
                        >
                            Componente {section.type} no encontrado
                        </Typography>
                    );
                }

                return (
                    <Component
                        key={section.id}
                        id={section.id}
                        research={research}
                        {...section.props}
                        children={section.children}
                    />
                );
            })}
        </Box>
    );
};

export default PageRenderer;