import { SECTION_REGISTRY } from './sectionRegistry';
import { Box, Typography } from '@mui/material';
import React from 'react';

class ComponentErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ComponentErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Typography color="error" sx={{ p: 2 }}>
                    Error al renderizar componente: {this.props.componentName}
                </Typography>
            );
        }

        return this.props.children;
    }
}

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
                    <ComponentErrorBoundary key={section.id} componentName={section.type}>
                        <Component
                            id={section.id}
                            research={research}
                            {...section.props}
                            children={section.children}
                        />
                    </ComponentErrorBoundary>
                );
            })}
        </Box>
    );
};

export default PageRenderer;