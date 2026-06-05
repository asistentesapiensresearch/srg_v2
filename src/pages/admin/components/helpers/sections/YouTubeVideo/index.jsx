import React, { useMemo } from 'react';
import { Box, Container } from '@mui/material';

export default function YouTubeVideo({
    url = "",
    aspect_ratio = "16/9",
    autoplay = false,
    mute = false,
    loop = false,
    show_controls = true,
    modest_branding = true,
    container_width = "lg",
    border_radius = 12,
    padding_y = 4,
    background_color = "transparent"
}) {

    // 1. Lógica para extraer el ID del video de YouTube
    const videoId = useMemo(() => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }, [url]);

    // 2. Construir la URL del Embed con los parámetros
    const embedUrl = useMemo(() => {
        if (!videoId) return "";

        const params = new URLSearchParams({
            autoplay: autoplay ? 1 : 0,
            mute: mute ? 1 : 0,
            controls: show_controls ? 1 : 0,
            modestbranding: modest_branding ? 1 : 0,
            rel: 0, // No mostrar videos relacionados al final
            showinfo: 0,
            iv_load_policy: 3, // Ocultar anotaciones
        });

        if (loop) {
            params.append('loop', '1');
            params.append('playlist', videoId); // Requerido por YT para que el loop funcione
        }

        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }, [videoId, autoplay, mute, loop, show_controls, modest_branding]);

    if (!videoId) {
        return (
            <Box sx={{ py: padding_y, textAlign: 'center', bgcolor: '#f5f5f5', border: '1px dashed #ccc' }}>
                Configura una URL válida de YouTube
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: background_color, py: padding_y }}>
            <Container maxWidth={container_width || false} disableGutters={!container_width}>
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        // Aspect Ratio moderno usando CSS
                        aspectRatio: aspect_ratio,
                        overflow: 'hidden',
                        borderRadius: `${border_radius}px`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        bgcolor: 'black'
                    }}
                >
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }}
                    ></iframe>
                </Box>
            </Container>
        </Box>
    );
}