import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

class ChartErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ChartErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 3, bgcolor: '#fff3cd', borderRadius: 2 }}>
                    <Alert severity="warning">
                        <Typography variant="subtitle2">
                            Error al renderizar gráfico
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {this.state.error?.message || 'Error desconocido'}
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ChartErrorBoundary;
