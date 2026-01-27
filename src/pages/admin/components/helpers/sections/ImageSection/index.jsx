// src/components/builder/sections/ImageSection/index.jsx
import { Box, Container } from "@mui/material";
import { useState, useEffect } from "react";
import { getUrl } from "aws-amplify/storage";
import { Link } from "react-router-dom";
import { StorageImage } from "@aws-amplify/ui-react-storage";

const ImageSection = ({
    // Imagen
    src,
    alt = "Imagen",

    // Dimensiones
    height = "400px",
    max_width = "1200px",
    width = "100%",

    // Ajustes de imagen
    object_fit = "cover",
    object_position = "center",

    // Bordes y efectos
    border_radius = "0px",
    box_shadow = "none",
    border = "none",

    // Layout
    container_width = "lg",
    alignment = "center",

    // Espaciado
    padding_top = 2,
    padding_bottom = 2,
    padding_horizontal = 2,
    margin_top = 0,
    margin_bottom = 0,

    // Fondo
    background_color = "transparent",

    // Hover effects
    hover_scale = false,
    hover_opacity = 1,

    // Link (opcional)
    link_url = "",
    link_target = "_self"
}) => {
    const [imageSrc, setImageSrc] = useState(src);

    // Cargar imagen desde S3 si es una key
    useEffect(() => {
        const loadImage = async () => {
            if (src && src.startsWith('builder/')) {
                try {
                    const result = await getUrl({ path: src });
                    setImageSrc(result.url.toString());
                } catch (error) {
                    console.error('Error loading image from S3:', error);
                    setImageSrc("");
                }
            } else if (src) {
                // Es una URL directa
                setImageSrc(src);
            } else {
                setImageSrc("");
            }
        };

        loadImage();
    }, [src]);

    const imageStyles = {
        width: width,
        height: height,
        maxWidth: max_width,
        objectFit: object_fit,
        objectPosition: object_position,
        borderRadius: border_radius,
        boxShadow: box_shadow,
        border: border,
        transition: 'all 0.3s ease',
        cursor: link_url ? 'pointer' : 'default',
        '&:hover': hover_scale ? {
            transform: 'scale(1.05)',
            opacity: hover_opacity
        } : {
            opacity: hover_opacity
        }
    };

    const containerStyles = {
        display: 'flex',
        justifyContent: alignment,
        alignItems: 'center',
        bgcolor: background_color,
        pt: padding_top,
        pb: padding_bottom,
        px: padding_horizontal,
        mt: margin_top,
        mb: margin_bottom
    };

    const ImageComponent = (
        imageSrc.startsWith('sections/') ?
            <StorageImage alt="sleepy-cat" path={imageSrc} className="h-[100%!important]" />
            :
            <Box
                component="img"
                src={imageSrc}
                alt={alt}
                sx={imageStyles}
                loading="lazy"
                onError={(e) => {
                    e.target.src = "";
                }}
            />
    );

    const content = link_url ? (
        <Link to={link_url} target={link_target} rel={link_target === "_blank" ? "noopener noreferrer" : undefined}>
            {ImageComponent}
        </Link>
    ) : (
        ImageComponent
    );

    return (
        <Box sx={containerStyles}>
            {container_width ? (
                <Container maxWidth={container_width}>
                    {content}
                </Container>
            ) : (
                content
            )}
        </Box>
    );
};

export default ImageSection;