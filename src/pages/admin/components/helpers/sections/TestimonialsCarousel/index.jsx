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
    gap = 15,
    itemsPerView = 3,
    autoplay = true,
    showArrows = true,
    showDots = true,
}) {
    const [data, setData] = useState([]);
    const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(true);

    const useCase = useMemo(() => {
        const repo = new TestimonialAmplifyRepository();
        return new FindTestimonialsUseCase(repo);
    }, []);

    const swiperKey = useMemo(
        () =>
            `swiper-${data.length}-${itemsPerView}-${autoplay}-${showArrows}-${showDots}-${gap}`,
        [data.length, itemsPerView, autoplay, showArrows, showDots, gap]
    );

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
                        } catch (e) {
                            if(e)
                            urls[t.id] = "";
                        }
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

    if (loading) {
        return (
            <Box py={10} textAlign="center">
                <Typography>Cargando testimonios...</Typography>
            </Box>
        );
    }

    if (data.length === 0) return null;

    const renderCard = (t) => {
        return (
            <Box
                className="
                    group min-w-[140px] 
                    rounded-[22px] 
                    border 
                    border-gray-200 
                    bg-white 
                    px-5
                    py-5 
                    shadow-sm
                    transition-all duration-200
                    hover:shadow-md
                    hover:scale-95
                    flex
                    flex-col
                    justify-between
                    h-full
                    gap-4
                "
                sx={{
                    borderTop: "3px solid #C10008",
                }}
            >
                <div>
                    <div className="relative">
                        <Quote
                            size={20}
                            style={{
                                color: "#C10008",
                                opacity: 0.2,
                                position: "absolute",
                                top: -5,
                                left: -5,
                            }}
                        />
                    </div>
                    {/* Contenido */}
                    <p className="text-sm text-gray-600 italic mt-10">
                        {t.content}
                    </p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-200 pt-2">
                    <Avatar
                        src={previews[t.id]}
                        sx={{
                            width: 40,
                            height: 40,
                            fontSize: 14,
                        }}
                    >
                        {t.name?.charAt(0)}
                    </Avatar>

                    <div>
                        <h5 className="font-semibold mb-0">
                            {t.name}
                        </h5>

                        {t.role && (
                            <p className="text-xs text-gray-500">
                                {t.role}
                            </p>
                        )}
                    </div>
                </div>

            </Box>
        )
    };

    return (
        <Box
            sx={{
                width: "100%",
                overflow: 'hidden',
                '& .swiper-pagination-bullet-active': {
                    backgroundColor: "#C8102E"
                },
                '& .swiper-pagination': {
                    position: 'relative',
                    bottom: '-40px',
                },
                display: "flex",
                flexDirection: "column",
                gap: 4,
            }}
        >
            <h3>Testimoniales</h3>
            <Box
                sx={{
                    width: "100%",
                    padding: '20px 0',
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {showArrows && (
                    <Box
                        className="testimonials-carousel-prev"
                        sx={{
                            display: {
                                xs: "none",
                                sm: "flex"
                            },
                            minWidth: "36px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: `1px solid #C8102E`,
                            color: "#C8102E",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                            '&:hover': {
                                backgroundColor: "#C8102E",
                                color: "#fff",
                            }
                        }}
                    >
                        ←
                    </Box>
                )}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Swiper
                        key={swiperKey}
                        direction={"horizontal"}
                        style={{ paddingBottom: '50px' }}
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={gap}
                        slidesPerView={1}
                        navigation={
                            showArrows
                                ? {
                                    prevEl: '.testimonials-carousel-prev',
                                    nextEl: '.testimonials-carousel-next',
                                }
                                : false
                        }
                        onBeforeInit={(swiper) => {
                            if (showArrows && swiper.params.navigation) {
                                swiper.params.navigation.prevEl = '.testimonials-carousel-prev';
                                swiper.params.navigation.nextEl = '.testimonials-carousel-next';
                            }
                        }}
                        pagination={showDots ? { clickable: true } : false}
                        autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
                        breakpoints={{
                            640: { slidesPerView: Math.min(Number(itemsPerView), 2) },
                            1024: { slidesPerView: Number(itemsPerView) },
                        }}
                    >
                        {data.map((t) => (
                            <SwiperSlide key={t.id} style={{height: "auto"}}>
                                {renderCard(t)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>

                {showArrows && (
                    <Box
                        className="testimonials-carousel-next"
                        sx={{
                            display: {
                                xs: "none",
                                sm: "flex"
                            },
                            minWidth: "36px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: `1px solid #C8102E`,
                            color: "#C8102E",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            userSelect: "none",
                            transition: "all 0.2s ease",
                            flexShrink: 0,
                            '&:hover': {
                                backgroundColor: "#C8102E",
                                color: "#fff",
                            }
                        }}
                    >
                        →
                    </Box>
                )}
            </Box>
        </Box>
    );
}