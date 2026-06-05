import { Box } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fieldsSection } from "./fields";

const EmbedWrapper = ({
  children,
  height,
  borderRadius,
  shadow,
  shadowColor
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


export default function EmbedContent({
    provider,
    height, 
    borderRadius, 
    shadow, 
    shadowColor 
}) {

    const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);

    const fieldsDB = fieldsSection.db?.[model];

    const embed = useMemo(() => {
      const value = data?.[fieldsDB?.embed];
      if (!value) return {};
      if (typeof value !== "string") return value;

      try {
        return JSON.parse(value);
      } catch (error) {
        if(error)
        console.error("Error parseando embed:", value);
        return {};
      }
    }, [data, fieldsDB]);

    const iframeUrl = useMemo(() => {
      return embed?.[provider] || "";
    }, [embed, provider]);
    
    return (
        <EmbedWrapper
            width="100%"
            height={height}
            borderRadius={borderRadius}
            shadow={shadow}
            shadowColor={shadowColor}
        >
          <iframe
              src={iframeUrl}
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
