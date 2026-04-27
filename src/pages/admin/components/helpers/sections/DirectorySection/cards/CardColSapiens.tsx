import { Box } from "@mui/material";
import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

const tagStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px 12px",
  boxSizing: "border-box",
  backgroundColor: "#FDEEEF",
  color: "var(--color-primary)",
  fontWeight: "bold",
  border: "1px solid #EF9A9A",
  borderRadius: "30px",
  fontSize: "11px",
  textAlign: "center",
};

export const CardColSapiens = ({ props }) => {
    console.log({props});
  const logo = useImageUrl(props?.logo) || "";
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
      {/* header card */}
      <Box
        className="bg-primary"
        sx={{
          width: "100%",
          minHeight: "80px",
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr auto",
          },
          alignItems: "center",
          color: "#fff",
          px: 2,
          py: 1.5,
        }}
      >
        {logo ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                md: "flex-start",
              },
              alignItems: "center",
              width: "100%",
            }}
          >
            <img
              src={logo}
              alt={props["Colegios"] || "Logo colegio"}
              style={{
                width: 60,
                height: 60,
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
            Sin logo, por revise en el administrador
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: {
              xs: "center",
              md: "flex-end",
            },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              color: "var(--color-primary)",
              px: 2,
              py: 1,
              borderRadius: "10px",
              minWidth: "52px",
              textAlign: "center",
            }}
          >
            D{props["Categoría"]}
          </Box>

          <Box
            sx={{
              backgroundColor: "#fff",
              color: "var(--color-primary)",
              px: 2,
              py: 1,
              borderRadius: "10px",
              minWidth: "62px",
              textAlign: "center",
            }}
          >
            {props["Calificación"]}
          </Box>
        </Box>
      </Box>

      {/* info card */}
      <Box
        sx={{
          px: 4,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
        }}
      >
        <h5 style={{ margin: 0, fontSize: "22px", lineHeight: 1.2 }}>
         {props["Colegios"]}
        </h5>

        <span
          style={{
            color: "#bdc3c7",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <DynamicIcon name="MapPin" color="#bdc3c7" size={28} />
          {props["Ciudad"]}, {props["Departamento"]}
        </span>

        <div style={{ padding: "0 5px" }}>
          <StartSection
            excelSource=""
            stars={props["Stars"]}
            typePage="admin"
            size={20}
          />
        </div>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {props["Sec"]?.length > 0 && <span style={tagStyle}>{props["Sec"]}</span>}

          {props["Cal"]?.length > 0 && (
            <span style={tagStyle}>Calendario {props["Cal"]}</span>
          )}

          {props["Orientación religiosa"]?.length > 0 && (
            <span style={tagStyle}>{props["Orientación religiosa"]}</span>
          )}

          {props["Género"]?.length > 0 && (
            <span style={tagStyle}>{props["Género"]}</span>
          )}

          {props["Zon"]?.length > 0 && (
            <span style={tagStyle}>{props["Zon"]}</span>
          )}
        </Box>

        {/* redes */}
        <Box
          sx={{
            mt: "auto",
            pt: 2,
            width: "100%",
            textAlign: "center",
          }}
        >
          {hasSocialMedia ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
            >
              {socialMedia.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DynamicIcon name="Facebook" color="#1877F2" size={20} />
                </a>
              )}

              {socialMedia.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DynamicIcon name="Twitter" color="#1DA1F2" size={20} />
                </a>
              )}

              {socialMedia.youtube && (
                <a
                  href={socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DynamicIcon name="Youtube" color="#CD201F" size={20} />
                </a>
              )}

              {socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DynamicIcon name="Instagram" color="#E4405F" size={20} />
                </a>
              )}
            </Box>
          ) : (
            <Box sx={{ color: "#000", fontSize: "15px" }}>
              No tiene redes sociales
            </Box>
          )}
        </Box>
      </Box>

      {/* footer card */}
      <Box
        sx={{
          backgroundColor: "#F7F7F7",
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
            color: "#000",
            m: 0,
            fontWeight: 600,
            fontSize: "14px",
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
              backgroundColor: "var(--color-primary)",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "999px",
              fontWeight: 700,
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