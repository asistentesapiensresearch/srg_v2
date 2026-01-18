// src/view/sections/FeaturesGrid/index.jsx
import { Box, Typography, Grid } from '@mui/material';
import PageRenderer from '../../../builder/Renderer';

const FeaturesGrid = ({
    columns,
    background_color,
    title_color,
    desc_color,
    title,
    desc,
    align_title,
    align_desc,
    children = [] // <--- RECIBIMOS LOS HIJOS AQUÍ
}) => {
    // Calcular ancho de columnas (Bootstrap style: 12 / cols)
    const numColumns = parseInt(columns) || 1;
    const xsValue = 12; // En móvil siempre full
    const mdValue = Math.max(1, Math.floor(12 / numColumns));

    return (
        <Box sx={{ bgcolor: background_color, py: 6, px: 2 }}>
            {/* Header del Grid */}
            <div style={{ marginBottom: '2rem' }}>
                {title && (
                    <Box textAlign={align_title}>
                        <Typography variant="h4" gutterBottom style={{ color: title_color }}>{title}</Typography>
                    </Box>
                )}
                {desc && (
                    <Box textAlign={align_desc}>
                        <Typography variant="body1" style={{ color: desc_color }}>{desc}</Typography>
                    </Box>
                )}
            </div>

            {/* Renderizado de Hijos en Grilla */}
            <Grid container spacing={4} sx={{ minHeight: '100px' }}>
                {children && children.length > 0 ? (
                    children.map((childSection) => (
                        <Grid item xs={xsValue} md={mdValue} key={childSection.id}>
                            {/* 🔥 RECURSIVIDAD: Usamos el Renderer para pintar el hijo */}
                            <Box sx={{ height: '100%' }}>
                                <PageRenderer sections={[childSection]} />
                            </Box>
                        </Grid>
                    ))
                ) : (
                    // Placeholder visual si no hay hijos
                    <Grid item xs={12}>
                        <Box sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            color: '#999'
                        }}>
                            Arrastra o añade componentes aquí
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default FeaturesGrid;