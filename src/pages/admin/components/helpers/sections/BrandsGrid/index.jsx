// src/view/sections/BrandsGrid/index.jsx
import React from 'react';
import { Box, Typography, Grid, Container, Tooltip } from '@mui/material';
import { StorageImage } from '@aws-amplify/ui-react-storage';

export default function BrandsGrid({
    brands_list, // <-- Recibido automáticamente del PageRenderer
    title,
    show_names,
    columns = 4,
    logo_height = 60,
    background_color = "#ffffff",
    grayscale = false
}) {
    // Obtenemos las marcas de la investigación actual
    // Nota: Si research.brands son IDs, necesitarás que los datos vengan poblados
    // o tener un hook que los busque. Aquí asumimos que research.brands trae los objetos.
    const brands = brands_list || [];
    console.log(brands)

    // Lógica de columnas de Material UI (12 unidades)
    const calculateGrid = (cols) => Math.max(1, Math.floor(12 / Number(cols)));

    return (
        <Box sx={{ bgcolor: background_color, width: '100%' }}>
            <Container maxWidth="lg" className='px-[0!important]'>
                {title && (
                    <Typography
                        variant="h4"
                        textAlign="center"
                        fontWeight="bold"
                        sx={{ mb: 6 }}
                    >
                        {title}
                    </Typography>
                )}

                <Grid className="w-full" container justifyContent="center" alignItems="center">
                    {brands.length > 0 ? (
                        brands.map((brand, index) => (
                            <Grid
                                item
                                key={brand.id || index}
                                xs={6}
                                sm={4}
                                md={calculateGrid(columns)}
                            >
                                <Tooltip title={brand.name || "Marca"}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                '& img': { filter: 'grayscale(0%)' }
                                            }
                                        }}
                                    >
                                        <StorageImage
                                            alt={brand.name}
                                            path={brand.key}
                                            style={{
                                                height: logo_height,
                                                filter: grayscale ? 'grayscale(100%)' : 'none',
                                                transition: 'filter 0.3s ease'
                                            }}
                                        />
                                        {show_names && (
                                            <Typography
                                                variant="caption"
                                                sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}
                                            >
                                                {brand.name}
                                            </Typography>
                                        )}
                                    </Box>
                                </Tooltip>
                            </Grid>
                        ))
                    ) : (
                        /* Mensaje para el modo edición si no hay marcas */
                        <Box sx={{ p: 4, border: '1px dashed #ccc', borderRadius: 2, color: '#999' }}>
                            No hay marcas asociadas a esta investigación.
                        </Box>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}