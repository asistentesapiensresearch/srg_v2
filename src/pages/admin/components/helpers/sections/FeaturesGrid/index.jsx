import { Box, Typography, Grid, Container } from '@mui/material';
import PageRenderer from '../../../builder/Renderer';

const FeaturesGrid = ({
    // Props de Tipo de Layout
    layout_type = 'even',

    // Props Columnas Iguales
    columns_desktop = 3,
    columns_tablet = 2,
    columns_mobile = 1,

    // Props Distribución Personalizada
    custom_desktop = "5,7",
    custom_tablet = "6,6",
    custom_mobile = "12,12",

    gap = 3,

    // Props de Contenido
    title,
    isBackground,
    background_color = '#ffffff',
    padding_y = 8,

    children = []
}) => {

    // 1. Cálculo para modo IGUAL ("even")
    const getEvenSpan = (val) => {
        const n = Number(val);
        if (!n || n <= 0) return 12;
        return Math.max(1, Math.floor(12 / n));
    };

    // 2. Cálculo para modo PERSONALIZADO ("custom")
    // Convierte "5,7" en [5, 7]. Si falla o está vacío, usa el fallback
    const parseCustomSpan = (str, fallback) => {
        if (!str) return [fallback];
        const arr = str.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 12);
        return arr.length > 0 ? arr : [fallback];
    };

    const customSpans = {
        xs: parseCustomSpan(custom_mobile, 12),
        sm: parseCustomSpan(custom_tablet, 6),
        md: parseCustomSpan(custom_desktop, 6)
    };

    // 3. Función maestra que decide el ancho de cada elemento según su índice
    const getChildSpan = (index, breakpoint) => {
        if (layout_type === 'even') {
            if (breakpoint === 'md') return getEvenSpan(columns_desktop);
            if (breakpoint === 'sm') return getEvenSpan(columns_tablet);
            if (breakpoint === 'xs') return getEvenSpan(columns_mobile);
        } else {
            // Modo Personalizado: Recorre el array. 
            // Si hay más hijos que anchos definidos, vuelve a empezar (ej. hijo 3 usa el ancho 0)
            const spans = customSpans[breakpoint];
            return spans[index % spans.length];
        }
    };

    return (
        <Box
            className="w-full"
            sx={{
                bgcolor: (isBackground) ? background_color : "none",
                py: padding_y,
                overflow: 'hidden'
            }}
        >
            <Container className='max-w-[initial!important] p-[0!important]'>
                {title && (
                    <Typography
                        variant="h4"
                        className="font-bold mb-8 text-center"
                        sx={{ color: 'inherit' }}
                    >
                        {title}
                    </Typography>
                )}

                <Grid
                    container
                    spacing={gap}
                    className="flex flex-wrap"
                >
                    {children && children.length > 0 ? (
                        children.map((child, index) => (
                            <Grid
                                key={child.id}
                                // 🔥 Usamos el INDICE para determinar el span exacto
                                size={{
                                    xs: getChildSpan(index, 'xs'),
                                    sm: getChildSpan(index, 'sm'),
                                    md: getChildSpan(index, 'md')
                                }}
                                className="flex"
                            >
                                <Box className="w-full flex flex-col">
                                    <PageRenderer sections={[child]} />
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                                <Typography className="text-gray-400 font-medium">
                                    Grid Vacío: Agregue elementos desde el panel de capas (+)
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeaturesGrid;