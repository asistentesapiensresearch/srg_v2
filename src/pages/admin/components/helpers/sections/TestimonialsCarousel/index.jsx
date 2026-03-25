import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Container, Avatar, Paper, Stack } from '@mui/material';
import { Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { getUrl } from 'aws-amplify/storage';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { TestimonialAmplifyRepository } from '@core/infrastructure/repositories/TestimonialAmplifyRepository';
import { FindTestimonialsUseCase } from '@core/application/caseUses/Testimonial/FindTestimonials';

export default function TestimonialsCarousel({
    institution,
    sourceMode = "context",
    targetEntityId,
    layout = "classic",
    isVertical = false,
    heightCarrusel = "400px",
    itemsPerView = 3,
    autoplay = true,
    showArrows = true,
    showDots = true,
    primaryColor = "#c10008",
    backgroundColor = "#f9fafb",
    backgroundColorContent = "#EEEEEE",
    borderRadius = "10px",
    shadow,
    shadowColor,
}) {
    const [data, setData] = useState([]);
    const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(true);

    const useCase = useMemo(() => {
        const repo = new TestimonialAmplifyRepository();
        return new FindTestimonialsUseCase(repo);
    }, []);

    // 🔥 Hack para que el carrusel se actualice al cambiar opciones en el editor
    const swiperKey = useMemo(() =>
        `swiper-${itemsPerView}-${autoplay}-${showArrows}-${showDots}-${layout}`,
        [itemsPerView, autoplay, showArrows, showDots, layout]);

    useEffect(() => {
        const loadData = async () => {
            const finalId = sourceMode === "context" ? institution?.id : targetEntityId;
            if (!finalId) {
                setLoading(false);
                setData([]);
                return;
            }

            try {
                const results = await useCase.execute(finalId);
                setData(results);

                const urls = {};
                for (const t of results) {
                    if (t.photo) {
                        try {
                            const res = await getUrl({ path: t.photo });
                            urls[t.id] = res.url.toString();
                        } catch (e) { urls[t.id] = ""; }
                    }
                }
                setPreviews(urls);
            } catch (e) {
                console.error("Error cargando testimonios", e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [sourceMode, targetEntityId, institution, useCase]);

    if (loading) return <Box py={10} textAlign="center"><Typography>Cargando testimonios...</Typography></Box>;
    if (data.length === 0) return null;

    // --- RENDERIZADO DE LOS DIFERENTES LAYOUTS ---
    const renderCard = (t) => {
        const isBubble = layout === 'bubble';
        const isMinimal = layout === 'minimal';

        return (
            <Paper
                elevation={isMinimal ? 0 : 1}
                sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: isMinimal ? 'none' : '1px solid #e2e8f0',
                    bgcolor: isBubble ? 'white' : 'transparent',
                    display: 'grid',
                    gridTemplateColumns: "0.1fr 1fr",
                    position: 'relative'
                }}
            >
                <Box>
                    <Avatar
                        src={previews[t.id]}
                        sx={{
                            position: 'absolute',
                            top: 30,
                            left: 40,
                            zIndex: 1, 
                            width: isMinimal ? 80 : 90,
                            height: isMinimal ? 80 : 90,
                            border: `2px solid ${primaryColor}`,
                            bgcolor: primaryColor,
                            color: 'white'
                        }}
                    >
                        {t.name.charAt(0)}
                    </Avatar>
                </Box>
                <Stack
                    sx={{
                        borderRadius,
                        padding: "10px 10px 0 60px",
                        bgcolor: backgroundColorContent,
                        boxShadow: shadow ? `0 6px 20px ${shadowColor}` : "none",
                    }}
                >
                    <Quote size={32} style={{ color: primaryColor, opacity: 0.3, marginBottom: 12 }} />
                    <Typography variant="body1" sx={{
                        fontStyle: 'italic',
                        mb: 3,
                        color: 'text.secondary',
                        fontSize: isMinimal ? '1.1rem' : '1rem'
                    }}>
                        "{t.content}"
                    </Typography>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1, color: 'text.primary' }}>
                            {t.name}
                        </Typography>
                        {t.role && (
                            <Typography variant="caption" color="text.secondary">
                                {t.role}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Paper>
        );
    };

    return (
        <Box sx={{
            bgcolor: backgroundColor,
            overflow: 'hidden',
            '& .swiper-button-next, & .swiper-button-prev': { color: primaryColor },
            '& .swiper-pagination-bullet-active': { bgcolor: primaryColor }
        }}>
            <Container maxWidth="lg">
                <Swiper
                    key={swiperKey} // Forzamos re-render al cambiar settings
                    direction={(isVertical) ? "vertical" : "horizontal"}
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={showArrows}
                    pagination={showDots ? { clickable: true } : false}
                    autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
                    breakpoints={{
                        640: { slidesPerView: Math.min(itemsPerView, 2) },
                        1024: { slidesPerView: itemsPerView },
                    }}
                    style={{ height: `${heightCarrusel}`, padding: '20px 0' }}
                >
                    {data.map((t) => (
                        <SwiperSlide key={t.id}>
                            {renderCard(t)}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
        </Box>
    );
}