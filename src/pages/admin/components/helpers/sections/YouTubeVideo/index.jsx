import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

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

    const currentVideo = videoUrls[currentIndex];
    const currentVideoId = getYouTubeVideoId(currentVideo);

    const getThumbnailUrl = (videoUrl) => {
        const id = getYouTubeVideoId(videoUrl);
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    };

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
            <Container
                maxWidth={hasMultipleVideos ? false : (container_width || false)}
                disableGutters={hasMultipleVideos || !container_width}
                sx={{
                    maxWidth: hasMultipleVideos ? '100% !important' : undefined,
                    px: hasMultipleVideos ? 0 : undefined,
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: hasMultipleVideos ? '22% 78%' : '1fr',
                        },
                        gap: { xs: 2, md: 2.25 },
                        alignItems: 'stretch',
                    }}
                >
                    {hasMultipleVideos && (
                        <Box
                            sx={{
                                order: { xs: 2, md: 1 },
                                display: 'flex',
                                flexDirection: 'column',
                                gap: { xs: 1, md: 1.4 },
                                height: { xs: 'auto', md: 500 },
                                overflowY: { md: 'auto' },
                                pr: { md: 0.5 },
                            }}
                        >
                            {videoUrls.map((videoUrl, index) => {
                                const thumbnailUrl = getThumbnailUrl(videoUrl);
                                const isActive = index === currentIndex;
                                const thumbId = getYouTubeVideoId(videoUrl);

                                return (
                                    <Box
                                        key={`${thumbId || index}-${index}`}
                                        component="button"
                                        type="button"
                                        onClick={() => setCurrentIndex(index)}
                                        sx={{
                                            width: '100%',
                                            display: 'block',
                                            p: 0.5,
                                            flex: { md: 1 },
                                            minHeight: { md: 112 },
                                            borderRadius: '14px',
                                            border: isActive ? '2px solid #c00002' : '1px solid #e5e7eb',
                                            backgroundColor: isActive ? '#fff5f5' : '#fff',
                                            boxShadow: isActive
                                                ? '0 10px 24px rgba(192,0,2,0.14)'
                                                : '0 6px 18px rgba(15,23,42,0.07)',
                                            cursor: 'pointer',
                                            transition: 'all 180ms ease',
                                            '&:hover': {
                                                borderColor: '#c00002',
                                                transform: 'translateX(2px)',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                height: { xs: 'auto', md: '100%' },
                                                minHeight: { xs: 0, md: 112 },
                                                aspectRatio: { xs: '16 / 9', md: 'auto' },
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                backgroundColor: '#111827',
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={thumbnailUrl}
                                                alt={`Vista previa del video ${index + 1}`}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'linear-gradient(to bottom, rgba(17,24,39,0.08), rgba(17,24,39,0.34))',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(255,255,255,0.94)',
                                                        color: '#c00002',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.95rem',
                                                        fontWeight: 700,
                                                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                                                    }}
                                                >
                                                    ▶
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}

                    <Box
                        sx={{
                            order: { xs: 1, md: 2 },
                            position: 'relative',
                            width: '100%',
                            aspectRatio: aspect_ratio,
                            overflow: 'hidden',
                            borderRadius: `${border_radius}px`,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            bgcolor: 'black',
                            minHeight: { xs: 280, md: 500 },
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

                        {hasMultipleVideos && currentVideoId && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    bottom: 16,
                                    zIndex: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.8,
                                    px: 1.4,
                                    py: 0.95,
                                    borderRadius: '999px',
                                    backgroundColor: 'rgba(15,23,42,0.44)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: '#ef4444',
                                        boxShadow: '0 0 0 4px rgba(239,68,68,0.16)',
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: '#fff',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {`Video ${currentIndex + 1} de ${videoUrls.length}`}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
