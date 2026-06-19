import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getYouTubeVideoId = (videoUrl) => {
    if (!videoUrl) return null;

    try {
        const parsedUrl = new URL(videoUrl);
        const hostname = parsedUrl.hostname.replace(/^www\./, "");

        if (hostname === "youtu.be") {
            const id = parsedUrl.pathname.split("/").filter(Boolean)[0];
            return id?.length === 11 ? id : null;
        }

        if (hostname.includes("youtube.com")) {
            const queryId = parsedUrl.searchParams.get("v");
            if (queryId?.length === 11) return queryId;

            const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
            const knownPathIndex = pathParts.findIndex((part) =>
                ["embed", "shorts", "live", "v"].includes(part)
            );
            const pathId = knownPathIndex >= 0 ? pathParts[knownPathIndex + 1] : null;
            return pathId?.length === 11 ? pathId : null;
        }
    } catch {
        const fallbackMatch = videoUrl.match(/(?:youtu\.be\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?/]{11})/);
        return fallbackMatch?.[1] || null;
    }

    return null;
};

const extractVideoUrls = (value) => {
    if (!value) return [];

    if (typeof value === "string") {
        try {
            return extractVideoUrls(JSON.parse(value));
        } catch {
            return value
                .split(/[\n,]+/)
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    if (Array.isArray(value)) {
        return value.flatMap((item) => extractVideoUrls(item));
    }

    if (typeof value === "object") {
        return Object.values(value).flatMap((item) => extractVideoUrls(item));
    }

    return [];
};

export default function YouTubeVideo({
    url = "",
    videos = [],
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

    const [currentIndex, setCurrentIndex] = useState(0);

    const videoUrls = useMemo(() => {
        const listUrls = extractVideoUrls(videos);

        return [url, ...listUrls]
            .filter(Boolean)
            .filter((videoUrl, index, list) => list.indexOf(videoUrl) === index)
            .filter((videoUrl) => Boolean(getYouTubeVideoId(videoUrl)));
    }, [videos, url]);

    useEffect(() => {
        if (currentIndex > videoUrls.length - 1) {
            setCurrentIndex(0);
        }
    }, [currentIndex, videoUrls.length]);

    // 1. Lógica para extraer el ID del video de YouTube
    const videoId = useMemo(() => {
        return getYouTubeVideoId(videoUrls[currentIndex]);
    }, [videoUrls, currentIndex]);

    const hasMultipleVideos = videoUrls.length > 1;

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? videoUrls.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === videoUrls.length - 1 ? 0 : prev + 1));
    };

    const arrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 30,
        display: 'inline-flex',
        visibility: 'visible',
        opacity: 1,
        width: { xs: 40, md: 48 },
        height: { xs: 54, md: 64 },
        borderRadius: '14px',
        color: '#c00002',
        backgroundColor: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(192,0,2,0.28)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)',
        transition: 'all 180ms ease',
        '& svg': {
            display: 'block',
            flexShrink: 0,
            stroke: 'currentColor',
        },
        '&:hover': {
            color: '#fff',
            backgroundColor: '#c00002',
            borderColor: '#c00002',
            boxShadow: '0 16px 32px rgba(192,0,2,0.32)',
        }
    };

    const dotStyles = (active) => ({
        width: active ? 22 : 8,
        height: 8,
        borderRadius: 999,
        border: 0,
        cursor: 'pointer',
        backgroundColor: active ? '#c00002' : 'rgba(255,255,255,0.68)',
        transition: 'all 180ms ease',
        boxShadow: active ? '0 4px 10px rgba(192,0,2,0.3)' : 'none',
    });

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
                        px: hasMultipleVideos ? { xs: 7, md: 1 } : 0,
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: aspect_ratio,
                            overflow: 'hidden',
                            borderRadius: `${border_radius}px`,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            bgcolor: 'black'
                        }}
                    >
                        <iframe
                            key={videoId}
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 1
                            }}
                        ></iframe>

                        {hasMultipleVideos && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    bottom: 16,
                                    transform: 'translateX(-50%)',
                                    zIndex: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.2,
                                    py: 0.8,
                                    borderRadius: 999,
                                    backgroundColor: 'rgba(15,23,42,0.44)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                {videoUrls.map((_, index) => (
                                    <Box
                                        key={index}
                                        component="button"
                                        type="button"
                                        aria-label={`Ver video ${index + 1}`}
                                        onClick={() => setCurrentIndex(index)}
                                        sx={dotStyles(index === currentIndex)}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>

                    {hasMultipleVideos && (
                        <>
                            <IconButton
                                aria-label="Video anterior"
                                onClick={goToPrev}
                                sx={{
                                    ...arrowStyles,
                                    left: { xs: 0, md: -65 },
                                }}
                            >
                                <ChevronLeft aria-hidden="true" size={30} strokeWidth={2.5} />
                            </IconButton>

                            <IconButton
                                aria-label="Video siguiente"
                                onClick={goToNext}
                                sx={{
                                    ...arrowStyles,
                                    right: { xs: 0, md: -65 },
                                }}
                            >
                                <ChevronRight aria-hidden="true" size={30} strokeWidth={2.5} />
                            </IconButton>
                        </>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
