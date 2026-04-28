import { Box, Tooltip, Typography } from "@mui/material";
import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";
import ImgFlagsCountry from '../results/ImgFlagsCountry';

const iconInfoStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  backgroundColor: "#f5f5f5",
  border: "1px solid #f1d0d2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const infoRowStyle = {
  display: "flex",
  flexDirection: {
    xs: "column",
    md: "row",
  },
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
  py: 2,
  borderBottom: "1px solid #eee",
};

const infoLabelStyle = {
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "4px",
  color: "#aaa",
  textTransform: "uppercase",
};

const infoValueStyle = {
  fontWeight: 800,
  fontSize: "18px",
  color: "#111",
};

const socialIconStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  backgroundColor: "#f2f2f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};


export const CardColSapiens = ({ props }) => {

  const logo = useImageUrl(props?.logo) || "";
  const portada = useImageUrl(props?.portadaPhoto) || "";
  const rectorPhoto = useImageUrl(props?.rectorPhoto) || "";

  const socialMedia = props?.socialMedia ? JSON.parse(props.socialMedia) : null;

  const hasSocialMedia =
    socialMedia && Object.values(socialMedia).some(Boolean);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        height: "100%",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        borderRadius: "12px",
      }}
    >

      {/* Header card */}
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url(${portada})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          width: "100%",
          minHeight: "220px",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.75))",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: 4,
            py: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: {
              xs: "center",
              md: "stretch",
            },
            gap: 1,
            height: "100%",
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row"
            },
            justifyContent: {
              xs: "center",
              md: "space-between"
            },
            gap: 2,
          }}>
            <Box sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                md: "flex-start",
              },
              alignItems: "center",
              gap: 2,
            }}>
              { logo ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "flex-start",
                    },
                    alignItems: "center",
                    width: "auto",
                  }}
                >
                  <img
                    src={logo}
                    alt={props["Colegios"] || "Logo colegio"}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: 1.4,
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                  }}
                >
                  Sin logo
                </Box>
              )}
              {/* categoria */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: {
                    xs: "center",
                    md: "flex-end",
                  },
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "space-between",
                    },
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {/* D1 activo */}
                  <Box
                    sx={{
                      backgroundColor: "#C10007",
                      color: "#fff",
                      px: 1.8,
                      py: 0.6,
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 700,
                      minWidth: "44px",
                      textAlign: "center",
                    }}
                  >
                    D{props["Categoría"]}
                  </Box>

                  {/* AAA+ más suave */}
                  <Box
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      px: 1.8,
                      py: 0.6,
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "1px solid rgba(255,255,255,0.3)",
                      backdropFilter: "blur(4px)",
                      minWidth: "58px",
                      textAlign: "center",
                    }}
                  >
                    {props["Calificación"]}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* años */}
            <Box sx={{
              display:"flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.8,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  fontSize: "12px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <DynamicIcon name="Flag" color="#fff" size={14} />
                {props["Aniversario"]} años
              </Box>
            </Box>
          </Box>
         {/* title, location, stars */} 
          <h5 style={{ margin: 0, lineHeight: 1.2, color: "#fff", fontWeight: "bold"}}>
            {props["Colegios"]}
          </h5>

          <Box
            sx={{
              color: "#bdc3c7",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <DynamicIcon name="MapPin" color="#bdc3c7" size={28} />
            {props["Ciudad"]}, {props["Departamento"]}
          </Box>
          {/* stars */}
          <Box sx={{marginLeft: "10px"}}>
            <StartSection
              excelSource=""
              stars={props["Stars"]}
              typePage="admin"
              size={15}
            />
          </Box>
        </Box>
      </Box>

      {/* info card */}
      <Box
        sx={{
          backgroundColor: "#fff",
          px: { xs: 3, md: 4 },
          py: 3,
        }}
      >
        {/* Iconos de características */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
            pb: 2.5,
            borderBottom: "1px solid #eee",
          }}
        >
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

        {props["Siglas certificación"] && (
          <Box sx={infoRowStyle}>
            <Typography sx={infoLabelStyle}>Certificado por</Typography>
            <Typography sx={infoValueStyle}>
              {props["Siglas certificación"]}
            </Typography>
          </Box>
        )}

        {props.languages && (
          <Box sx={infoRowStyle}>
            <Typography sx={infoLabelStyle}>Idiomas</Typography>
            <ImgFlagsCountry languages={props.languages} size={24} />
          </Box>
        )}

        {hasSocialMedia && (
          <Box sx={{ ...infoRowStyle, borderBottom: "none" }}>
            <Typography sx={infoLabelStyle}>Redes</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  <Box sx={socialIconStyle}>
                    <DynamicIcon name="Facebook" color="#111" size={20} />
                  </Box>
                </a>
              )}

              {socialMedia.twitter && (
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  <Box sx={socialIconStyle}>
                    <DynamicIcon name="Twitter" color="#111" size={20} />
                  </Box>
                </a>
              )}

              {socialMedia.youtube && (
                <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                  <Box sx={socialIconStyle}>
                    <DynamicIcon name="Youtube" color="#111" size={20} />
                  </Box>
                </a>
              )}

              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  <Box sx={socialIconStyle}>
                    <DynamicIcon name="Instagram" color="#111" size={20} />
                  </Box>
                </a>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* footer card */}
      <Box
        sx={{
          backgroundColor: "var(--color-primary)",
          borderTop: "1px solid #bdc3c7",
          width: "100%",
          minHeight: "88px",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "60px 1fr auto",
          },
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            mx: {
              xs: "auto",
              md: 0,
            },
            backgroundImage: rectorPhoto ? `url(${rectorPhoto})` : "none",
            backgroundColor: "#e5e7eb",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            borderRadius: "50%",
          }}
        />

        <Box
          component="p"
          sx={{
            color: "#fff",
            m: 0,
            fontWeight: 800,
            fontSize: "18px",
            textAlign: {
              xs: "center",
              md: "left",
            },
          }}
        >
          {props.rectorName || "Sin rector registrado"}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: {
              xs: "center",
              md: "flex-end",
            },
          }}
        >
          <a
            href={props.path ? props.path : undefined}
            target={"_blank"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#000",
              padding: "10px 18px",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "14px",
              textDecoration: "none",
              lineHeight: 1,
              whiteSpace: "nowrap",
              width: "fit-content",
            }}
          >
            Ver detalles
          </a>
        </Box>
      </Box>
    </Box>
  );
};