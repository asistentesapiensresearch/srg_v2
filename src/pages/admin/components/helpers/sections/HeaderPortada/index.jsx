import { Box, Typography } from "@mui/material";
import { useImageUrl } from "@src/hooks/useImageUrl";
import { useSelector } from "react-redux";
import CalificationAndCategory from "../CalificationAndCategory";
import PageRenderer from "../../../builder/Renderer";
import InstitutionHighlights from "../InstitutionHighlights";
import { fieldsSection } from "./fields";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getUrl } from "aws-amplify/storage";

const HeaderPortada = ({
  typePage,
  excelSource,
  // Propiedades que aplican solo para investigación "Para cuando es 100% dependiente del administrador y no de BD o excel"
  src = "",
  country,
  title,
  subtitle,
  shortDescription,
  itemsHighlights = [],
  // Estilos
  height = "400px",
  children = []
}) => {

    const [imageSrc, setImageSrc] = useState(src);

    useEffect(() => {
      if(typePage === "investigation") {
        const loadImage = async () => {
            if (src && src.startsWith('builder/')) {
                try {
                    const result = await getUrl({ path: src });
                    setImageSrc(result.url.toString());
                } catch (error) {
                    console.error('Error loading image from S3:', error);
                    setImageSrc("");
                }
            } else if (src) {
                setImageSrc(src);
            } else {
                setImageSrc("");
            }
        };

        loadImage();
      }
    }, [src, typePage]);

    const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);

    const dataExcels = useSelector((state) => state.sections.fetchData.sheets[excelSource]);

    const fieldsDB = fieldsSection.db?.[model];
    const fieldsExcel = fieldsSection.excel?.[excelSource];

    // merge y guardo los datos en useMemo
    const mergedData = useMemo(() => {
      if(typePage != "investigation") {
        const excelData = dataExcels?.data || {};
        const portadaPhoto = data?.[fieldsDB?.portadaPhoto] || "";
        const slogan = data?.[fieldsDB?.slogan] || "";
        const city = fieldsExcel?.ciudad
          ? String(excelData[fieldsExcel.ciudad] || "").toUpperCase()
          : "";
  
        const dept = fieldsExcel?.departamento
          ? String(excelData[fieldsExcel.departamento] || "").toUpperCase()
          : "";
  
        const fullLocation =
          dept && dept !== city && !city.includes(dept)
            ? `${city}, ${dept}`
            : city;
  
        const nameValue = data?.[fieldsDB?.name] || "";
        const words = nameValue ? nameValue.split(" ") : [];
  
        const lastWordTitle = words.length ? words.pop() : "";
        const title = words.join(" ");
  
        return {
          title,
          lastWordTitle,
          portadaPhoto,
          slogan,
          fullLocation,
        };
      }
      // Para cuando es personalizado "la info biene del administrador"

      const words = title ? title.split(" ") : [];
      const lastWordTitle = words.length ? words.pop() : "";

      return {
        title: words.join(" "),
        lastWordTitle,
        subtitle,
        portadaPhoto: imageSrc,
        slogan: shortDescription,
        fullLocation: country.toUpperCase(),
      }
    }, [data, dataExcels, fieldsDB, fieldsExcel, typePage, title, subtitle, shortDescription, country, imageSrc]);

    const backgroundImage = useImageUrl(mergedData?.portadaPhoto || "");

    return (
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: "auto", md: height }, // Fixed the hard height cutoff for mobile flex
          color: "#fff",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: (typePage === "investigation") ? "init" : "center",
          position: "relative", // Ensures all underlying relative children size correctly
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Contenido principal encima del overlay */}
        <Box
          sx={{
            position: "relative", // Changed from absolute mapping to prevent overflow breakage
            width: "100%",
            flexGrow: 1, // Stretches this overlay to the literal bottom of the parent minHeight
            zIndex: 2,
            color: "#000",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          {/* Top content area with Title and Shield flexed smoothly */}
          <Box sx={{ flexGrow: 1, py: { xs: 8, md: 8 }, pb: { xs: 4, md: 6 } }}>
            <Box
              className="grid grid-cols-1 md:grid-cols-2 md:w-[90%] gap-4 w-[90%] mx-auto"
            >
              <Box className="flex flex-col justify-center gap-2 md:gap-4 mt-6 md:mt-0">
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50px',
                    padding: '6px 16px 6px 6px',
                    width: 'fit-content',
                    gap: '12px',
                    margin: { xs: '0 auto', md: '0' },
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box
                    sx={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <MapPin size={16} color="#fff" strokeWidth={2.5} />
                  </Box>
                  <Typography sx={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {mergedData.fullLocation}
                  </Typography>
                </Box>
                <h1 
                  style={{color: "#fff", fontWeight: "bold", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.2 }}
                  className="text-center md:text-left mt-2 md:mt-0"
                >
                  {mergedData.title}
                  <span style={{color: "#F0C30E", fontSize: "clamp(2rem, 5vw, 4rem)"}}>
                    {` ${mergedData.lastWordTitle}`}
                  </span>
                </h1>
                {
                  (typePage === "investigation") &&
                  <h5 style={{color: "#fff", lineHeight: 1.2 }}>{mergedData.subtitle}</h5>
                }
                <p 
                  style={{color:"#fff", fontSize: "clamp(1rem, 2.5vw, 1.8rem)", lineHeight: 1.4}}
                  className="text-center md:text-left mt-2"  
                >
                  {mergedData.slogan}
                </p>
              </Box>
              {/* Aquí iría el escudo */}
              <Box
                className="flex flex-col justify-center items-center md:items-end w-full"
              >
                <CalificationAndCategory
                  excelSource={excelSource}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ padding: "0 0 40px 0" }}>
            {children && children.length > 0 && children?.some((child) => child.type === "BrandsGrid") ?  (
                    children.filter((child) => child.type === "BrandsGrid")
                    .map((child) => (
                      <Box 
                        sx={{
                          display: { xs: "none", md: "flex" },
                          flexDirection: "column",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "12px",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          backdropFilter: "blur(5px)",
                          minHeight: "70px",
                          padding: "20px",
                          width: "90%",
                          margin: "0 auto",
                          gap: "18px"
                        }} 
                        key={child.id} 
                      >
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
                          <Typography sx={{ color: "#fff", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", opacity: 0.9, whiteSpace: "nowrap" }}>
                            CERTIFICADO / ACREDITADO POR
                          </Typography>
                          <Box sx={{ flexGrow: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.15)" }} />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", overflow: "hidden" }}>
                          <Box sx={{ 
                            width: '100%',
                            '& > div': { py: 0, '& > div': { p: 0, maxWidth: "100%" } }, 
                            '& img': { height: '35px !important', objectFit: 'contain' },
                            '& .MuiTypography-root.brand-name': { display: 'none' }
                          }}>
                            <PageRenderer sections={[child]} />
                          </Box>
                        </Box>
                      </Box>
                    ))
                ) : (
                  <Box className="w-[90%] mx-auto p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                      <Typography className="text-gray-400 font-medium text-center">
                          Marcas vacias: Aquí debe ir el componente de Grilla de Marcas (Brands) (+)
                      </Typography>
                  </Box>
                )
            }
          </Box>
          {/* Aquí va el contenido info colegio asegurándose de ir hasta el fondo */}
          <InstitutionHighlights
            typePage={typePage}
            excelSource={excelSource}
            itemsHighlights={itemsHighlights}
          />

        </Box>

        {/* Estado en caso de no encontrar registros */}
        {!data && itemsHighlights.length === 0 && (
          <Box sx={{ position: "relative", zIndex: 2, mt: 2 }}>
            <span>No se encontró el registro solicitado.</span>
          </Box>
        )}
      </Box>
    );
}

export default HeaderPortada
