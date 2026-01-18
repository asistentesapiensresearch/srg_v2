// src/view/sections/TextSection/index.jsx
import { Box, Container, Typography } from "@mui/material";

const TextSection = ({ content, align, color, font, fontSize }) => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: align }}>
                <Typography
                    style={{ fontFamily: font }}
                    sx={{ color: color, fontSize: fontSize, whiteSpace: 'pre-line' }}
                >
                    {content}
                </Typography>
            </Box>
        </Container>
    );
};

export default TextSection;