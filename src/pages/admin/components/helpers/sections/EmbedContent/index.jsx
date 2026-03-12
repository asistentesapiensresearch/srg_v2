import { Box } from "@mui/material";

const EmbedWrapper = ({
  children,
  height,
  borderRadius,
  shadow,
  shadowColor,
}) => {

  return (
    <Box
      sx={{
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: `${borderRadius}px`,
        boxShadow: shadow ? `0 6px 20px ${shadowColor}` : "none",
      }}
    >
      {children}
    </Box>
  );
};


export default function EmbedContent ({
    url, width,height, borderRadius, shadow, shadowColor
}) {

    console.log({ url, width, height, borderRadius, shadow, shadowColor });
    return (
        <EmbedWrapper
            width="100%"
            height={height}
            borderRadius={borderRadius}
            shadow={shadow}
            shadowColor={shadowColor}
        >
            <iframe
                src={url}
                width="100%"
                height={height}
                loading="lazy"
                style={{
                    border: "none",
                    display: "block"
                }}
                allowFullScreen
            />
        </EmbedWrapper>
  );
}
