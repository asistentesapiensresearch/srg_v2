import { Box } from "@mui/material";
import DataSourceManager from "@src/core/data/DataSourceManager";
import { useEffect, useMemo, useState } from "react";

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
    dataSourceMode = "context",
    modelName = "Institution",
    searchField = "name",
    searchValue = "",
    provider,
    height, 
    borderRadius, 
    shadow, 
    shadowColor 
}) {

    const [fetchedRecord, setFetchedRecord] = useState(null);

    useEffect(() => {

      if (dataSourceMode !== 'custom' || !modelName || !searchField || !searchValue) {
            return;
        }
      
      const fetchDataModel = async () => {
        try {
          const { data }  = await DataSourceManager.findByField(modelName, searchField, searchValue, 1);
          if(data && data.length > 0) {
            setFetchedRecord(data[0]);
          } else {
            setFetchedRecord(null);
          }
        } catch (error) {
          console.error("Error buscando en BD:", error);
          setFetchedRecord(null);
        } 

      }

      fetchDataModel();
    }, [dataSourceMode, modelName, searchField, searchValue]);


    const embed = useMemo(() => {
      if (!fetchedRecord?.embed) return {};

      try {
        return typeof fetchedRecord.embed === "string"
          ? JSON.parse(fetchedRecord.embed)
          : fetchedRecord.embed;
      } catch (error) {
        console.error("Error parseando embed:", error);
        return {};
      }
    }, [fetchedRecord]);

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
