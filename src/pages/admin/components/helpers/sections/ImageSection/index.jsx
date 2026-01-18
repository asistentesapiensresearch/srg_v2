// src/components/builder/sections/ImageSection/index.jsx
import { Box } from "@mui/material";

const ImageSection = ({ src, alt, height, objectFit, borderRadius }) => {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}>
            <Box 
                component="img"
                src={src}
                alt={alt}
                sx={{
                    width: '100%',
                    height: height,
                    objectFit: objectFit,
                    borderRadius: borderRadius,
                    maxWidth: '1200px' // Opcional, para que no se estire demasiado
                }}
            />
        </Box>
    );
};

export default ImageSection;