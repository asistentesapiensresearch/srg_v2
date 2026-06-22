import React, { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import { Box, Typography } from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { getUrl } from "aws-amplify/storage";
import { Preloader } from "@src/components/preloader";

const client = generateClient();

const GalleryRenderer = ({
  sourceType = "custom",
  galleryId,
  research,
  institution,
  playInterval = 2000,
  slideDuration = 550,
  thumbnailBarPosition = "bottom",
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
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const resolvedThumbnailPosition =
    thumbnailBarPosition === "bottom" ? "left" : thumbnailBarPosition || "left";

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);

      try {
        let targetGalleryData = null;

        if (sourceType === "entity") {
          const entityId = research?.id || institution?.id;

          if (entityId) {
            const { data } = await client.models.Gallery.list({
              filter: { entityId: { eq: entityId } },
            });

            if (data.length > 0) targetGalleryData = data[0];
          }
        } else if (sourceType === "custom" && galleryId) {
          const { data } = await client.models.Gallery.get({ id: galleryId });
          targetGalleryData = data;
        }

        if (targetGalleryData && targetGalleryData.images) {
          const rawImages =
            typeof targetGalleryData.images === "string"
              ? JSON.parse(targetGalleryData.images)
              : targetGalleryData.images;

          const formattedImages = await Promise.all(
            rawImages.map(async (img, index) => {
              try {
                const signedUrl = await getUrl({ path: img.original }).then(
                  (res) => res.url.toString()
                );

                return {
                  original: signedUrl,
                  thumbnail: signedUrl,
                  description: img.description || "",
                  originalAlt: img.description || `Imagen ${index + 1}`,
                };
              } catch (e) {
                return null;
              }
            })
          );

          setImages(formattedImages.filter(Boolean));
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

  const renderCustomItem = (item) => {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 340, md: 520 },
          overflow: "hidden",
          borderRadius: "18px",
          backgroundColor: "#e5e7eb",
        }}
      >
        <Box
          component="img"
          src={item.original}
          alt={item.originalAlt}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.28) 28%, rgba(0,0,0,0.05) 48%, rgba(0,0,0,0) 68%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            color: "#fff",
            zIndex: 2,
            background:
              "linear-gradient(to bottom, rgba(18, 18, 18, 0) 0%, rgb(18 18 18 / 52%) 28%, rgba(18, 18, 18, 0.72) 100%)",
            backdropFilter: "blur(3px)",
            pt: { xs: 2.5, md: 4 },
          }}
        >
          {item.description && (
            <Box
              sx={{
                width: "100%",
                minHeight: { xs: 72, md: 94 },
                display: "flex",
                alignItems: "center",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 28%, rgba(255,246,246,0.26) 62%, rgba(192,0,2,0.2) 100%)",
                boxShadow: "0 -10px 30px rgba(0,0,0,0.16)",
                px: { xs: 2.2, md: 5.5 },
                py: { xs: 1.6, md: 2 },
                backdropFilter: "blur(12px)",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "0.82rem", md: "1.08rem" },
                  fontWeight: 700,
                  lineHeight: 1.45,
                  textShadow: "0 1px 3px rgba(0,0,0,0.45)",
                }}
              >
                {item.description}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const renderCustomThumbInner = (item) => {
    return (
      <Box
        sx={{
          width: "100%",
          height: 64,
          overflow: "hidden",
          borderRadius: "10px",
        }}
      >
        <Box
          component="img"
          src={item.thumbnail}
          alt={item.originalAlt || item.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box py={10} display="flex" justifyContent="center">
        <Preloader />
      </Box>
    );
  }

  if (error || !images || images.length === 0) {
    return (
      <Box p={4} textAlign="center" bgcolor="grey.100" borderRadius={2}>
        <Typography color="text.secondary">
          {error || "Galería vacía o no encontrada"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="gallery-wrapper py-4"
      dir={RightToLeft ? "rtl" : "ltr"}
      sx={{
        "& .image-gallery-left-nav, & .image-gallery-right-nav": {
          top: "50%",
          width: { xs: 38, md: 46 },
          height: { xs: 54, md: 66 },
          borderRadius: "14px",
          backgroundColor: "rgb(189 184 184 / 48%)",
          border: "1px solid rgba(192,0,2,0.28)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          color: "#c00002",
          padding: 0,
          transform: "translateY(-50%)",
          transition:
            "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
          backdropFilter: "blur(8px)",
          "&:hover": {
            backgroundColor: "#c00002",
            borderColor: "#c00002",
            color: "#fff",
            boxShadow: "0 14px 30px rgba(192,0,2,0.32)",
            transform: "translateY(-50%) scale(1.04)",
          },
          "&:focus": {
            outline: "none",
          },
          "& .image-gallery-svg": {
            width: { xs: 24, md: 40 },
            height: { xs: 24, md: 40 },
            filter: "none",
            strokeWidth: 2.4,
          },
        },
        "& .image-gallery-left-nav": {
          left: { xs: 8, md: 14 },
        },
        "& .image-gallery-right-nav": {
          right: { xs: 8, md: 14 },
        },
      }}
    >
      <ImageGallery
        items={images}
        renderItem={renderCustomItem}
        renderThumbInner={renderCustomThumbInner}
        slideInterval={playInterval}
        slideDuration={slideDuration}
        thumbnailPosition={resolvedThumbnailPosition}
        showNav={showArrows}
        showThumbnails={showThumbnails}
        showBullets={showBulletIndicators}
        showIndex={showSliderCounter}
        showPlayButton={false}
        showFullscreenButton={showFullscreenButton}
        infinite={InfiniteLoop}
        slideOnThumbnailOver={SlideOnThumbnailHover}
        disableKeyDown={!KeyboardNavigation}
        lazyLoad={LazyLoadImages}
        isRTL={RightToLeft}
      />
    </Box>
  );
};

export default GalleryRenderer;
