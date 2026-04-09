import { Box } from '@mui/material'
import { useMemo } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import DynamicIcon from '../../../builder/helpers/DynamicIcon'

const CardsCarousel = ({
    title,
    itemsCustom,
    gap = 20,
    bgBorde = "#C8102E",
    itemsPerView = 4,
    autoplay = true,
    showArrows = true,
    showDots = true,
}) => {
    const items = useMemo(() => itemsCustom || [], [itemsCustom])

    const swiperKey = useMemo(
        () =>
            `swiper-${itemsPerView}-${autoplay}-${showArrows}-${showDots}-${gap}`,
        [itemsPerView, autoplay, showArrows, showDots, gap]
    )

    const renderCarrusel = () => (
        <Box
            sx={{
                width: "100%",
                padding: `20px 0`,
                display: "flex",
                alignItems: "center",
                gap: 2,
                '& .swiper-pagination-bullet-active': {
                    backgroundColor: bgBorde,
                },
                '& .swiper-pagination': {
                    position: 'relative',
                    marginTop: '40px',
                }
            }}
            className="h-full"
        >
            {showArrows && (
                <Box
                    className="cards-carousel-prev"
                    sx={{
                        minWidth: "30px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: `1px solid ${bgBorde}`,
                        color: bgBorde,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "all 0.2s ease",
                        '&:hover': {
                            backgroundColor: bgBorde,
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
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={Number(gap)}
                    slidesPerView={1}
                    navigation={
                        showArrows
                            ? {
                                prevEl: '.cards-carousel-prev',
                                nextEl: '.cards-carousel-next',
                            }
                            : false
                    }
                    onBeforeInit={(swiper) => {
                        if (showArrows && swiper.params.navigation) {
                            swiper.params.navigation.prevEl = '.cards-carousel-prev'
                            swiper.params.navigation.nextEl = '.cards-carousel-next'
                        }
                    }}
                    pagination={showDots ? { clickable: true } : false}
                    autoplay={autoplay ? { delay: 4000, disableOnInteraction: false } : false}
                    breakpoints={{
                        640: { slidesPerView: Math.min(Number(itemsPerView), 2) },
                        1024: { slidesPerView: Number(itemsPerView) },
                    }}
                >
                    {items.map((el, idx) => (
                        <SwiperSlide key={`infoCard-${idx}`} style={{height: "auto", display:"flex"}}>
                            <Box
                                className="
                                    h-auto
                                    rounded-r-xl
                                    hover:shadow-md
                                    transition-all duration-200
                                    hover:scale-95
                                    group min-w-[140px] 
                                    rounded-[22px] 
                                    border 
                                    border-gray-200 
                                    bg-white 
                                    px-5
                                    py-8 
                                    shadow-sm
                                "
                                sx={{
                                    transition: "all 300ms ease-out",
                                    borderTop: "3px solid #C10008"
                                }}
                            >
                                <div className='flex gap-2 items-center'>
                                    <DynamicIcon name={el.icon || "Globe"} color={"#C10008"} size={20} />
                                    <h5 className="font-semibold mb-0">
                                        {el.label}
                                    </h5>
                                </div>
                                <div className='mt-2'>
                                    <p className="text-sm">
                                        {el.value}
                                    </p>
                                    <span
                                        style={{
                                            padding: "2px 30px",
                                            backgroundColor: "#FDEEEF",
                                            color: "#C10008",
                                            fontWeight: "bold",
                                            border: "1px solid #EF9A9A",
                                            borderRadius: "30px",
                                            fontSize: "11px",
                                        }}
                                    >
                                        {el.tag}
                                    </span>
                                </div>
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>

            {showArrows && (
                <Box
                    className="cards-carousel-next"
                    sx={{
                        minWidth: "30px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: `1px solid ${bgBorde}`,
                        color: bgBorde,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "all 0.2s ease",
                        '&:hover': {
                            backgroundColor: bgBorde,
                            color: "#fff",
                        }
                    }}
                >
                    →
                </Box>
            )}
        </Box>
    )

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
            }}
        >
            <h3>{title}</h3>
            {renderCarrusel()}
        </Box>
    )
}

export default CardsCarousel