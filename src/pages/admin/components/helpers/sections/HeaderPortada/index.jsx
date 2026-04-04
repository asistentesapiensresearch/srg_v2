import { Box, Typography } from "@mui/material";
import { useImageUrl } from "@src/hooks/useImageUrl";
import { useSelector } from "react-redux";
import CalificationAndCategory from "../CalificationAndCategory";
import PageRenderer from "../../../builder/Renderer";
import InstitutionHighlights from "../InstitutionHighlights";

const HeaderPortada = ({
  excelSource,
  sourceConfig, 
  filterField, 
  filterValue,
  // Estilos
  height = "400px",
  children = []
}) => {

    let title;
    let wordsTitle;
    let lastWordtitle;
    const { data } = useSelector((state) => state.sections.fetchData.databaseDownload);
    const backgroundImage = useImageUrl(data?.portadaPhoto);

    if(data?.name) {
      wordsTitle = data.name.split(" ");
      lastWordtitle = wordsTitle.pop();
      title = wordsTitle.join(" ");
    }
    const slogan = data?.slogan || "Slogan no disponible";


    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "360px",
          height,
          color: "#fff",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >

        {/* Contenido principal encima del overlay */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 2,
            color: "#000",
            backgroundColor: "rgba(0, 0, 0, 0.6)"
          }}
        >
          <Box
           sx={{
            display: "grid",
            gridTemplateRows: "1fr auto auto",
            height: "100%",
           }}
          >
            <Box
              className="grid grid-cols-1 md:grid-cols-2 md:w-[90%] gap-4 w-[80%] mx-auto"
            >
              <Box className="flex flex-col justify-center">
                <h1 
                  style={{color: "#fff", fontWeight: "bold", fontSize: "clamp(2.2rem, 5vw, 4rem)"}}
                  className="text-center md:text-left"
                >
                  {title}
                  <span style={{color: "#F0C30E", fontSize: "clamp(2.2rem, 5vw, 4rem)"}}>
                    {` ${lastWordtitle}`}
                  </span>
                </h1>
                <p 
                  style={{color:"#fff", fontSize: "clamp(1rem, 2.5vw, 1.8rem)", lineHeight: 1.4}}
                  className="text-center md:text-left"  
                >
                  {slogan}
                </p>
              </Box>
              {/* Aquí iría el componente branch interno */}
              <Box
                className="flex flex-col justify-center items-center md:items-end"
              >
                <CalificationAndCategory
                  sourceConfig={sourceConfig}
                  filterField={filterField}
                  filterValue={filterValue}
                />
              </Box>

            </Box>

            <Box sx={{ padding: "15px 0" }}>
              {children && children.length > 0 && children?.some((child) => child.type === "BrandsGrid") ?  (
                      children.filter((child) => child.type === "BrandsGrid")
                      .map((child) => (
                        <Box key={child.id} className="w-full flex flex-col">
                          <PageRenderer sections={[child]} />
                        </Box>
                      ))
                  ) : (
                    <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                        <Typography className="text-gray-400 font-medium">
                            Marcas vacias: Aquí debe ir el componente de Grilla de Marcas (Brands) (+)
                        </Typography>
                    </Box>
                  )
              }
            </Box>
            {/* Aquí va el contenido info colegio */}
            <InstitutionHighlights 
              excelSource={excelSource} 
            />

          </Box>

         
        </Box>

        {/* Estado en caso de no encontrar registros */}
        {!data && (
          <Box sx={{ position: "relative", zIndex: 2, mt: 2 }}>
            <span>No se encontró el registro solicitado.</span>
          </Box>
        )}
      </Box>
    );
}

export default HeaderPortada
