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
          height: { xs: 400, md: 700 },
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
            objectFit: "contain",
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
            bgcolor: "rgba(0,0,0,0.2)",
          }}
        >

          {(item.description) && (
            <Typography
              sx={{
                margin: "40px 70px",
                fontSize: { xs: "1rem", md: "2rem" },
                opacity: 0.95,
              }}
            >
              {item.description}
            </Typography>
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
    <Box className="gallery-wrapper py-4" dir={RightToLeft ? "rtl" : "ltr"}>
      <ImageGallery
        items={images}
        renderItem={renderCustomItem}
        renderThumbInner={renderCustomThumbInner}
        slideInterval={playInterval}
        slideDuration={slideDuration}
        thumbnailPosition={thumbnailBarPosition}
        showNav={showArrows}
        showThumbnails={showThumbnails}
        showBullets={showBulletIndicators}
        showIndex={showSliderCounter}
        showPlayButton={showAutoplayButton}
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