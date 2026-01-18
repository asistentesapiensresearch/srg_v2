import { Box, Typography, Button } from '@mui/material';

// El componente recibe "data" (lo que edita el usuario)
const HeroSection = ({ title, subtitle, buttonText, backgroundColor }) => {
    return (
        <Box sx={{ bgcolor: backgroundColor, p: 8, textAlign: 'center' }}>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="h5" sx={{ my: 2 }}>{subtitle}</Typography>
            {buttonText && <Button variant="contained">{buttonText}</Button>}
        </Box>
    );
};

export default HeroSection;