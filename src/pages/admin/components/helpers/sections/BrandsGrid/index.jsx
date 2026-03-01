import React from 'react';
import { Box, Typography, Grid, Container, Tooltip } from '@mui/material';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import Marquee from "react-fast-marquee"; // 🔥 NUEVO IMPORT

export default function BrandsGrid({
    brands_list,
    title,
    show_names = true,

    // Layout
    layout_mode = "marquee",
    columns = 4,

    // Marquee Props
    marquee_direction = "left",
    marquee_speed = 40,
    pause_on_hover = true,

    // Styles
    logo_height = 60,
    background_color = "#ffffff",
    grayscale = true,
    hover_scale = true
}) {
    const brands = brands_list || [];

    // Cálculo para Grilla
    const calculateGrid = (cols) => Math.max(1, Math.floor(12 / Number(cols)));

    // Tarjeta individual reutilizable para ambos modos
    const renderBrandItem = (brand, index, isMarquee) => (
        <Tooltip title={brand.name || "Marca"} key={brand.id || index}>
            <Box
                sx={{
                    // Si está en marquee, le damos margen horizontal para separarlos. Si está en grid, el spacing lo hace MUI.
                    mx: isMarquee ? 4 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',

                    // EFECTOS HOVER
                    '&:hover': {
                        transform: hover_scale ? 'scale(1.1)' : 'none',
                        '& img': {
                            filter: 'grayscale(0%) opacity(1)'
                        },
                        '& .brand-name': {
                            color: 'primary.main',
                            fontWeight: 600
                        }
                    }
                }}
            >
                <StorageImage
                    alt={brand.name}
                    path={brand.key}
                    style={{
                        height: `${logo_height}px`,
                        width: 'auto',
                        objectFit: 'contain',
                        // Si grayscale es true, lo pone gris y un poco transparente. Si no, lo deja normal.
                        filter: grayscale ? 'grayscale(100%) opacity(0.7)' : 'none',
                        transition: 'all 0.4s ease'
                    }}
                />

                {show_names && (
                    <Typography
                        className="brand-name"
                        variant="caption"
                        sx={{
                            mt: 2,
                            fontWeight: 500,
                            color: 'text.secondary',
                            transition: 'color 0.3s'
                        }}
                    >
                        {brand.name}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );

    return (
        <Box sx={{ bgcolor: background_color, width: '100%', py: 2, overflow: 'hidden' }}>
            <Container maxWidth="lg" className='px-[0!important]'>
                {title && (
                    <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
                        {title}
                    </Typography>
                )}

                {brands.length > 0 ? (
                    layout_mode === 'marquee' ? (
                        // =========================================
                        // MODO: CARRUSEL INFINITO
                        // =========================================
                        <Box sx={{ width: '100vw', position: 'relative', left: '50%', right: '50%', ml: '-50vw', mr: '-50vw' }}>
                            <Marquee
                                direction={marquee_direction}
                                speed={marquee_speed}
                                pauseOnHover={pause_on_hover}
                                gradient={true} // Opcional: Agrega un desvanecido a los bordes
                                gradientColor={background_color} // Para que el desvanecido coincida con tu fondo
                                gradientWidth={50}
                                autoFill={true}
                            >
                                {brands.map((brand, idx) => renderBrandItem(brand, idx, true))}
                            </Marquee>
                        </Box>
                    ) : (
                        // =========================================
                        // MODO: GRILLA ESTÁTICA
                        // =========================================
                        <Grid container spacing={4} justifyContent="center" alignItems="center">
                            {brands.map((brand, idx) => (
                                <Grid item key={brand.id || idx} xs={6} sm={4} md={calculateGrid(columns)}>
                                    {renderBrandItem(brand, idx, false)}
                                </Grid>
                            ))}
                        </Grid>
                    )
                ) : (
                    // Estado Vacío (Editor)
                    <Box sx={{ p: 4, border: '2px dashed #e2e8f0', borderRadius: 2, textAlign: 'center', color: '#64748b' }}>
                        No hay marcas asociadas. Añade marcas desde la configuración.
                    </Box>
                )}
            </Container>
        </Box>
    );
}