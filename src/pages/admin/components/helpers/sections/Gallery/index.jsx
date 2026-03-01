import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/image-gallery.css"; // Importar estilos CSS (asegúrate de usar la ruta /css/)
import { Box, Typography } from '@mui/material';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import { Preloader } from '@src/components/preloader';

const client = generateClient();

const GalleryRenderer = ({
    // Props de Origen de datos
    sourceType = 'custom',
    galleryId,
    research,
    institution,

    // Props de Personalización (mapeados desde el Builder)
    playInterval = 2000,
    slideDuration = 550,
    thumbnailBarPosition = 'bottom',
    showArrows = true,
    showThumbnails = true,
    showBulletIndicators = true,
    showSliderCounter = false,
    showAutoplayButton = true,
    showFullscreenButton = true,
    InfiniteLoop = true,
    SlideOnThumbnailHover = false,
    KeyboardNavigation = true,
    LazyLoadImages = false,
    RightToLeft = false,
    // (VerticalSliding no es nativo de la librería para la imagen principal, 
    // pero thumbnailBarPosition='left' o 'right' ya cumple esa función visual)
}) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGallery = async () => {
            setLoading(true);
            try {
                let targetGalleryData = null;

                // 1. MODO ENTIDAD (AUTOMÁTICO)
                if (sourceType === 'entity') {
                    const entityId = research?.id || institution?.id;
                    if (entityId) {
                        const { data } = await client.models.Gallery.list({
                            filter: { entityId: { eq: entityId } }
                        });
                        if (data.length > 0) targetGalleryData = data[0];
                    }
                }

                // 2. MODO PERSONALIZADO (MANUAL)
                else if (sourceType === 'custom' && galleryId) {
                    const { data } = await client.models.Gallery.get({ id: galleryId });
                    targetGalleryData = data;
                }

                // 3. PROCESAR IMÁGENES
                if (targetGalleryData && targetGalleryData.images) {
                    const rawImages = typeof targetGalleryData.images === 'string'
                        ? JSON.parse(targetGalleryData.images)
                        : targetGalleryData.images;

                    // Convertir claves S3 a URLs firmadas
                    const formattedImages = await Promise.all(rawImages.map(async (img) => {
                        try {
                            const signedUrl = await getUrl({ path: img.original }).then(res => res.url.toString());
                            return {
                                original: signedUrl,
                                thumbnail: signedUrl,
                                description: img.description || "",
                                originalClass: 'rounded-lg',
                            };
                        } catch (e) {
                            return null;
                        }
                    }));

                    setImages(formattedImages.filter(img => img !== null));
                }
            } catch (err) {
                console.error("Error loading gallery", err);
                setError("No se pudo cargar la galería");
            } finally {
                setLoading(false);
            }
        };

        loadGallery();
    }, [sourceType, galleryId, research, institution]);

    if (loading) return <Box py={10} display="flex" justifyContent="center"><Preloader /></Box>;

    if (error || !images || images.length === 0) {
        return (
            <Box p={4} textAlign="center" bgcolor="grey.100" borderRadius={2}>
                <Typography color="text.secondary">{error || "Galería vacía o no encontrada"}</Typography>
            </Box>
        );
    }

    return (
        <Box className="gallery-wrapper py-4" dir={RightToLeft ? 'rtl' : 'ltr'}>
            <ImageGallery
                items={images}

                // --- MAPEO DE OPCIONES AL COMPONENTE ---
                slideInterval={playInterval}
                slideDuration={slideDuration}
                thumbnailPosition={thumbnailBarPosition}

                // Mostrar/Ocultar elementos
                showNav={showArrows}
                showThumbnails={showThumbnails}
                showBullets={showBulletIndicators}
                showIndex={showSliderCounter}
                showPlayButton={showAutoplayButton}
                showFullscreenButton={showFullscreenButton}

                // Comportamientos
                infinite={InfiniteLoop}
                slideOnThumbnailOver={SlideOnThumbnailHover}
                disableKeyDown={!KeyboardNavigation} // Lógica inversa para la librería
                lazyLoad={LazyLoadImages}
                isRTL={RightToLeft}

            // Opcional: Si quieres que arranque solo si hay botón de autoplay
            // autoPlay={false} 
            />
        </Box>
    );
};

export default GalleryRenderer;