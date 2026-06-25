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
    isBackground = false,
    background_color = "#ffffff",
    contained_card = false,
    hover_scale = true
}) {
    const brands = brands_list || [];
    const [hoveredBrand, setHoveredBrand] = React.useState(null);
    // Cálculo para Grilla
    const calculateGrid = (cols) => Math.max(1, Math.floor(12 / Number(cols)));

    // Tarjeta individual reutilizable para ambos modos
    const renderBrandItem = (brand, index, isMarquee, isBackground) => (
      <Tooltip title={brand.name || "Marca"} key={brand.id || index}>
        <Box
          component={brand.link ? "a" : "div"}
          href={brand.link || undefined}
          target={brand.link ? "_blank" : undefined}
          rel={brand.link ? "noopener noreferrer" : undefined}
          sx={{
            textDecoration: "none",
            color: "inherit",

            mx: isMarquee ? 4 : 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: brand.link ? "pointer" : "default",
            transition: "all 0.3s ease-in-out",

            "&:hover": {
              transform: hover_scale ? "scale(1.1)" : "none",
              "& img": {
                filter: "grayscale(0%) opacity(1)",
              },
              "& .brand-name": {
                color: "primary.main",
                fontWeight: 600,
              },
            },
          }}
        >
          <Box
            onMouseEnter={() => setHoveredBrand(brand.id || index)}
            onMouseLeave={() => setHoveredBrand(null)}
            sx={{
              width: contained_card ? { xs: 140, sm: 180 } : "auto",
              height: contained_card ? { xs: 76, sm: 92 } : "auto",
              p: contained_card ? { xs: 1.5, sm: 2 } : 0,
              mx: contained_card ? 0 : (isMarquee ? 4 : 0),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: contained_card ? "hidden" : "visible",
              borderRadius: contained_card ? 2 : 0,
              border: contained_card ? "1px solid rgba(15, 23, 42, 0.08)" : "none",
              backgroundColor: contained_card ? "#ffffff" : "transparent",
              boxShadow: contained_card ? "0 4px 12px rgba(15, 23, 42, 0.05)" : "none",
              transition: "all 0.3s ease-in-out",
              transform:
                hoveredBrand === (brand.id || index) && hover_scale
                  ? "scale(1.1)"
                  : "scale(1)",
            }}
          >
            <StorageImage
              alt={brand.name}
              path={brand.key}
              style={{
                height: contained_card ? "100%" : `${logo_height}px`,
                width: "100%",
                maxWidth: "180px",
                maxHeight: contained_card ? `${logo_height}px` : "none",
                objectFit: "contain",
                transform: contained_card ? "scale(0.78)" : "none",
                opacity: hoveredBrand === (brand.id || index) ? 1 : 0.5,
                filter:
                  hoveredBrand === (brand.id || index)
                    ? "none"
                    : "grayscale(100%)",

                mixBlendMode: "normal",

                transition: "all 0.4s ease",
              }}
            />
          </Box>

          {show_names && (
            <Typography
              className="brand-name"
              variant="caption"
              sx={{
                mt: 2,
                fontWeight: 500,
                color: "text.secondary",
                transition: "color 0.3s",
              }}
            >
              {brand.name}
            </Typography>
          )}
        </Box>
      </Tooltip>
    );

  return (
        <Box sx={{
            bgcolor: !contained_card && isBackground ? background_color : 'none',
            width: '100%',
            py: 2,
            overflow: 'hidden',
        }}>
            <Container
                maxWidth={contained_card ? "xl" : "lg"}
                className={contained_card ? undefined : 'px-[0!important]'}
                sx={contained_card ? {
                    bgcolor: isBackground ? background_color : 'transparent',
                    borderRadius: isBackground ? 3 : 0,
                    px: isBackground ? { xs: 2, md: 6 } : '0 !important',
                    py: isBackground ? { xs: 3, md: 5 } : 0,
                    minHeight: isBackground ? { xs: 140, md: 190 } : 'auto',
                    border: isBackground ? '1px solid rgba(15, 23, 42, 0.06)' : 'none',
                    boxShadow: isBackground ? '0 8px 24px rgba(15, 23, 42, 0.06)' : 'none',
                } : undefined}
            >
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
                        <Box sx={{
                            width: contained_card ? '100%' : '100vw',
                            position: 'relative',
                            left: contained_card ? 0 : '50%',
                            right: contained_card ? 0 : '50%',
                            ml: contained_card ? 0 : '-50vw',
                            mr: contained_card ? 0 : '-50vw',
                        }}>
                            <Marquee
                                direction={marquee_direction}
                                speed={marquee_speed}
                                pauseOnHover={pause_on_hover}
                                gradient={isBackground} // Opcional: Agrega un desvanecido a los bordes
                                gradientColor={((isBackground) ? background_color : 'none')} // Para que el desvanecido coincida con tu fondo
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
                                    {renderBrandItem(brand, idx, false, isBackground)}
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
