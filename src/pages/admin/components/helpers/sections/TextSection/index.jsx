// src/view/sections/TextSection/index.jsx
import { Box, Container, Typography } from "@mui/material";

const TextSection = ({
    content,
    align = "left",
    color = "#333",
    font = "sans-serif",
    fontSize = "1rem",
    // Valores por defecto por si el usuario no los ha configurado aún
    paddingTop = "32px",
    paddingBottom = "32px",
    paddingX = "16px"
}) => {
    return (
        <Container
            maxWidth="lg"
            sx={{
                // Mui Shorthands: pt = padding-top, pb = padding-bottom, px = padding-left & right
                pt: paddingTop,
                pb: paddingBottom,
                px: paddingX,
                transition: 'padding 0.3s ease' // Suaviza el cambio en el editor
            }}
        >
            <Box sx={{ textAlign: align }}>
                <Typography
                    style={{ fontFamily: font }}
                    sx={{
                        color: color,
                        fontSize: fontSize,
                        whiteSpace: 'pre-line',
                        lineHeight: 1.6 // Mejora la legibilidad
                    }}
                >
                    {content}
                </Typography>
            </Box>
        </Container>
    );
};

export default TextSection;