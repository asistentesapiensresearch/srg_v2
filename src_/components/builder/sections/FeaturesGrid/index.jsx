// src/components/builder/sections/FeaturesGrid/index.jsx
import { Box, Typography, Grid, Paper } from '@mui/material';
// 🔥 Importamos el Renderer para usarlo de forma recursiva
import PageRenderer from '../../Renderer';

// Componente que envuelve el contenido de una celda
const FeatureCellContainer = ({ sections }) => (
    <Paper elevation={2} sx={{ p: 2, height: '100%', minHeight: '100px', border: '1px dashed #ccc' }}>
        {/* Renderizamos las secciones anidadas dentro de la celda */}
        <PageRenderer sections={sections} />
        {/* Aquí es donde eventualmente iría un botón "+ Añadir elemento" */}
    </Paper>
);

const FeaturesGrid = ({
    columns,
    background_color,
    title_color,
    desc_color,
    title,
    desc,
    align_title,
    align_desc
}) => {
    // 1. Usar el valor de columns para calcular el tamaño de la celda
    const numColumns = parseInt(columns) || 1;
    const mdValue = Math.max(1, Math.floor(12 / numColumns));

    // 2. Deserializar las celdas (vienen como string desde el estado)
    let parsedCells = [];

    return (
        <Box sx={{ bgcolor: background_color, py: 6, px: 2 }}>
            <div style={{ marginBottom: '1rem' }}>
                {
                    title && <div className={`flex justify-${align_title}`}>
                        <Typography variant="h4" gutterBottom style={{ color: title_color }}>{title}</Typography>
                    </div>
                }
                {
                    desc && <div className={`flex justify-${align_desc}`}>
                        <Typography variant="body1" color="text.secondary" style={{ color: desc_color }}>{desc}</Typography>
                    </div>
                }
            </div>
            <Grid container spacing={2} maxWidth="lg" margin="0 auto">
                {parsedCells.map((cell) => (
                    <Grid key={cell.id} size={mdValue}>
                        {/* 🔥 Renderizamos el contenido recursivo de la celda */}
                        <FeatureCellContainer sections={cell.sections} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FeaturesGrid;