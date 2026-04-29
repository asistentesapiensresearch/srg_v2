import { Box, Tooltip } from "@mui/material";
import { Quote } from "lucide-react";
import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  height: "100%",
  overflow: "hidden",
  boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
  borderRadius: "12px",
  '&:hover': {
    transform: "scale(1.03)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
  }
};

const headerStyle = (portada: string) => ({
  position: "relative",
  backgroundImage: `url(${portada})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  width: "100%",
  height: 220, // 🔥 misma altura en todas
  overflow: "hidden",
});

const overlayStyle = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.78))",
  zIndex: 1,
};

const headerContentStyle = {
  position: "relative",
  zIndex: 2,
  height: "100%",
  px: { xs: 3, md: 4 },
  py: 3,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: { xs: "center", md: "stretch" },
  gap: 1,
};

const topHeaderStyle = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  justifyContent: { xs: "center", md: "space-between" },
  alignItems: "center",
  gap: 2,
};

const logoAndBadgesStyle = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  justifyContent: { xs: "center", md: "flex-start" },
  alignItems: "center",
  gap: 2,
};

const logoStyle: React.CSSProperties = {
  width: 70,
  height: 70,
  objectFit: "contain",
};

const badgeGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const badgePrimaryStyle = {
  backgroundColor: "rgba(193, 0, 7, 0.85)",
  color: "#fff",
  px: 1.8,
  py: 0.6,
  borderRadius: "999px",
  fontSize: { xs: "14px", md: "20px" },
  fontWeight: 800,
  minWidth: "44px",
  textAlign: "center",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255,255,255,0.2)",
  transition: "all 0.2s ease",
  '&:hover': {
    fontSize: {
      md: "24px",
    }
  }
};

const badgeGlassStyle = {
  backgroundColor: "rgba(255,255,255,0.16)",
  color: "#fff",
  px: 1.8,
  py: 0.6,
  borderRadius: "999px",
  fontSize: { xs: "14px", md: "20px" },
  fontWeight: 700,
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(4px)",
  minWidth: "58px",
  textAlign: "center",
  transition: "all 0.2s ease",
  '&:hover': {
    fontSize: {
      md: "24px",
    }
  }
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.2,
  color: "#fff",
  fontWeight: "bold",
  textDecoration: "none",
};

const locationStyle = {
  color: "rgba(255,255,255,0.75)",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
};

const iconInfoStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  backgroundColor: "#fff5f5",
  border: "1px solid #f1d0d2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const infoSectionStyle = {
  backgroundColor: "#fff",
  px: { xs: 3, md: 4 },
  py: 3,
};

const iconsWrapperStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: 1.5,
};

const footerStyle = {
  background: "linear-gradient(135deg, #C10007 0%, #9f0006 100%)",
  width: "100%",
  minHeight: "128px",
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "0.9fr 1.4fr",
  },
  alignItems: "center",
  gap: { xs: 2, md: 3 },
  px: { xs: 2.5, md: 3 },
  py: { xs: 2.5, md: 2 },
};

const rectorBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.8,
  justifyContent: { xs: "center", md: "flex-start" },
};

const rectorPhotoStyle = (rectorPhoto: string) => ({
  width: 64,
  height: 64,
  flexShrink: 0,
  backgroundImage: rectorPhoto ? `url(${rectorPhoto})` : "none",
  backgroundColor: "#e5e7eb",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  borderRadius: "50%",
  border: "2px solid rgba(255,255,255,0.45)",
  boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
});

const rectorLabelStyle = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "2px",
  textTransform: "uppercase",
  opacity: 0.7,
  mb: 0.4,
};

const rectorNameStyle = {
  fontWeight: 800,
  fontSize: { xs: "15px", md: "17px" },
  lineHeight: 1.2,
};

const quoteBoxStyle = {
  position: "relative",
  color: "#fff",
  pl: { xs: 0, md: 2.5 },
  pt: { xs: 1.5, md: 0 },
  borderLeft: {
    xs: "none",
    md: "1px solid rgba(255,255,255,0.25)",
  },
  textAlign: { xs: "center", md: "left" },
};

const quoteTextStyle = {
  m: 0,
  fontSize: { xs: "13px", md: "14px" },
  lineHeight: 1.45,
  fontWeight: 500,
  opacity: 0.95,
  display: "-webkit-box",
  WebkitLineClamp: 4,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export const CardColSapiens = ({ props }) => {
  const logo = useImageUrl(props?.logo) || "";
  const portada = useImageUrl(props?.portadaPhoto) || "";
  const rectorPhoto = useImageUrl(props?.rectorPhoto) || "";

  return (
    <a
      href={props.path}
      target="_blank"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <Box sx={cardStyle}>
        <Box sx={headerStyle(portada)}>
          <Box sx={overlayStyle} />

          <Box sx={headerContentStyle}>
            <Box sx={topHeaderStyle}>
              <Box sx={logoAndBadgesStyle}>
                {logo ? (
                  <img
                    src={logo}
                    alt={props["Colegios"] || "Logo colegio"}
                    style={logoStyle}
                  />
                ) : (
                  <Box sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                    Sin logo
                  </Box>
                )}
              </Box>

              <Box sx={badgeGroupStyle}>
                <Box sx={badgePrimaryStyle}>D{props["Categoría"]}</Box>
                <Box sx={badgeGlassStyle}>{props["Calificación"]}</Box>
              </Box>
            </Box>

            <h5 style={titleStyle}>{props["Colegios"]}</h5>

            <Box sx={locationStyle}>
              <DynamicIcon name="MapPin" color="rgba(255,255,255,0.75)" size={26} />
              {props["Ciudad"]}, {props["Departamento"]} | <DynamicIcon name="Flag" color="#fff" size={14} /> {props["Aniversario"]} años
            </Box>

            <Box sx={{ ml: { xs: 0, md: 1 } }}>
              <StartSection
                excelSource=""
                stars={props["Stars"]}
                typePage="admin"
                size={20}
                gap={8}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={infoSectionStyle}>
          <Box sx={iconsWrapperStyle}>
            {props["Sec"]?.length > 0 && (
              <Tooltip title={props["Sec"]} arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="Building2" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}

            {props["Cal"]?.length > 0 && (
              <Tooltip title={`Calendario ${props["Cal"]}`} arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="CalendarDays" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}

            {props["Orientación religiosa"]?.length > 0 && (
              <Tooltip title={props["Orientación religiosa"]} arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="Church" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}

            {props["Género"]?.length > 0 && (
              <Tooltip title={props["Género"]} arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="Users" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}

            {props["Zon"]?.length > 0 && (
              <Tooltip title={props["Zon"]} arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="MapPinned" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}

            {props["Doble titulación"] === "Sí" && (
              <Tooltip title="Doble Titulación" arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="GraduationCap" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}

            {props["Intercambios o salidas internacionales"] === "Sí" && (
              <Tooltip title="Intercambios o salidas internacionales" arrow>
                <Box sx={iconInfoStyle}>
                  <DynamicIcon name="Plane" color="#C10007" size={20} />
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={footerStyle}>
          <Box sx={rectorBoxStyle}>
            <Box sx={rectorPhotoStyle(rectorPhoto)} />

            <Box sx={{ color: "#fff" }}>
              <Box sx={rectorLabelStyle}>Rectoría</Box>
              <Box sx={rectorNameStyle}>
                {props.rectorName || "Sin rector registrado"}
              </Box>
            </Box>
          </Box>

          <Box sx={quoteBoxStyle}>
            <Box component="p" sx={quoteTextStyle}>
              Ser miembros de Sapiens ha sido una de las mejores decisiones de
              nuestra institución.
            </Box>
          </Box>
        </Box>
      </Box>
    </a>
  );
};