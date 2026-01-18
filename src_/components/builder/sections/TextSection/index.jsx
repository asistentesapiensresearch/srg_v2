import { Box, Container, Typography } from "@mui/material";

const TextSection = ({ content, align, color, fontSize }) => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: align }}>
                <Typography
                    sx={{ color: color, fontSize: fontSize, whiteSpace: 'pre-line' }}
                >
                    {content}
                </Typography>
            </Box>
        </Container>
    );
};

export default TextSection;