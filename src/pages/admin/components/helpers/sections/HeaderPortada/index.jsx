import { Box } from "@mui/material";
import DataSourceManager from "@src/core/data/DataSourceManager";
import { useEffect, useMemo, useState } from "react";

// const EmbedWrapper = ({
//   children,
//   height,
//   borderRadius,
//   shadow,
//   shadowColor
// }) => {

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height,
//         overflow: "hidden",
//         borderRadius: `${borderRadius}px`,
//         boxShadow: shadow ? `0 6px 20px ${shadowColor}` : "none",
//       }}
//     >
//       {children}
//     </Box>
//   );
// };

const HeaderPortada = ({
    dataSourceMode = "context",
    modelName = "Institution",
    searchField = "name",
    searchValue = "",
  }) => {

    // Estado para almacenar el registro obtenido de la búsqueda
    const [fetchedRecord, setFetchedRecord] = useState(null);

   useEffect(() => {
   
        // validacion de que si estemos en modo 'custom' y que tengamos los parámetros necesarios para hacer la búsqueda
         if (dataSourceMode !== 'custom' || !modelName || !searchField || !searchValue) {
               return;
           }
         
         const fetchDataModel = async () => {
          try {
            const {data}= await DataSourceManager.findByField(modelName, searchField, searchValue, 1);
            if(data && data.lenght > 0){
              setFetchedRecord(data[0]);
            }else{
              setFetchedRecord(null);
            }
          } catch (error) {
            console.error("Error buscando en BD:", error);
            setFetchedRecord(null);
          }
   
         }
   
         fetchDataModel();
       }, [dataSourceMode, modelName, searchField, searchValue]); 

       
    
  return (
    <Box>
      <h1>Header Portada</h1>
    </Box>
  )
}

export default HeaderPortada
