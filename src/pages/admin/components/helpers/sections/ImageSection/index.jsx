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
    hover_rotar = 45,

    // Link (opcional)
    link_url = "",
    link_target = "_self"
}) => {
    const [imageSrc, setImageSrc] = useState(src);

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
                setImageSrc(src);
            } else {
                setImageSrc("");
            }
        };

        loadImage();
    }, [src]);

    // Usamos 'style' nativo para que funcione con ambos componentes (MUI Box y Amplify StorageImage)
    const baseImageStyles = {
        width: width,
        height: height,
        maxWidth: max_width,
        objectFit: object_fit,
        objectPosition: object_position,
        borderRadius: border_radius,
        boxShadow: box_shadow,
        border: border,
        transition: 'all 0.3s ease',
        display: 'block' // Evita márgenes fantasma debajo de la imagen
    };

    // Estilos de la sección completa
    const sectionStyles = {
        bgcolor: background_color,
        pt: padding_top,
        pb: padding_bottom,
        px: padding_horizontal,
        mt: margin_top,
        mb: margin_bottom,
        width: '100%',
        display: 'flex',
        justifyContent: alignment
    };

    // Estilos del Wrapper del enlace/imagen (para el hover y posicionamiento)
    const wrapperStyles = {
        display: 'inline-flex',
        justifyContent: alignment,
        alignItems: 'center',
        width: width, // El wrapper también debe respetar el ancho para la alineación
        maxWidth: max_width,
        textDecoration: 'none',
        cursor: link_url ? 'pointer' : 'default',
        overflow: 'hidden', // Necesario para que el border-radius corte el hover_scale
        borderRadius: border_radius, // Aplicamos el border_radius también al wrapper
        '&:hover img': { // Apuntamos a la etiqueta <img> directamente para los efectos
            transform: hover_scale ? `scale(1.05) rotate(${hover_rotar}deg)` : 'none',
            opacity: hover_opacity,
        }
    };

    // 1. Determinar si es de Amplify Storage
    const isStorageImage = imageSrc && imageSrc.startsWith('sections/');

    // 2. Construir la imagen
    const ImageRender = isStorageImage ? (
        <StorageImage
            alt={alt || "Image"}
            path={imageSrc}
            style={baseImageStyles} // Usamos style nativo, NO className ni sx
        />
    ) : (
        <Box
            component="img"
            src={imageSrc}
            alt={alt}
            style={baseImageStyles} // Usamos style nativo aquí también para consistencia
            loading="lazy"
            onError={(e) => { e.target.src = ""; }}
        />
    );

    // 3. Envolver en Link si es necesario, O en un Box normal para los efectos hover
    const ImageWrapper = link_url ? (
        <Box component={Link} to={link_url} target={link_target} rel={link_target === "_blank" ? "noopener noreferrer" : undefined} sx={wrapperStyles}>
            {ImageRender}
        </Box>
    ) : (
        <Box sx={wrapperStyles}>
            {ImageRender}
        </Box>
    );

    // 4. Retornar el contenedor principal
    return (
        <Box sx={sectionStyles}>
            {container_width && container_width !== false && container_width !== "false" ? (
                <Container maxWidth={container_width} sx={{ display: 'flex', justifyContent: alignment }}>
                    {ImageWrapper}
                </Container>
            ) : (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: alignment }}>
                    {ImageWrapper}
                </Box>
            )}
        </Box>
    );
};

export default ImageSection;