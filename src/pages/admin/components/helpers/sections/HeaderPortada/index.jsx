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
            const { data } = await DataSourceManager.findByField(modelName, searchField, searchValue, 1);
            if (data && data.length > 0) {
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

       // Procesamos el campo 'embed' del registro obtenido, asumiendo que es un JSON string o un objeto
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

    

    // EXTRAER campos clave (título y slogan) del registro obtenido
    const title = fetchedRecord?.name || "Título no disponible";
    const slogan = fetchedRecord?.slogan || "Slogan no disponible";

    // Usamos la imagen del logo o path como fondo de sección (si existe).
    // Se puede ajustar aquí según el campo que uses en tu modelo.
    const backgroundImage =
      fetchedRecord?.coverImage || // campo personalizado posible
      fetchedRecord?.logo ||
      fetchedRecord?.path ||
      "";

    console.log("Registro 1212:", fetchedRecord);

    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "360px",
          color: "#fff",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          p: 4,
        }}
      >

        {/* Contenido principal encima del overlay */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "#fff",
          }}
        >
          <h1 className="w-full text-2xl mt-20 font-black font-[Roboto] text-center" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", marginBottom: "0.6rem" }}>
            {title}
          </h1>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2.5vw, 1.8rem)", lineHeight: 1.4 }}>
            {slogan}
          </p>

         
        </Box>

        {/* Estado en caso de no encontrar registros */}
        {!fetchedRecord && (
          <Box sx={{ position: "relative", zIndex: 2, mt: 2 }}>
            <span>No se encontró el registro solicitado.</span>
          </Box>
        )}
      </Box>
    );
}

export default HeaderPortada
