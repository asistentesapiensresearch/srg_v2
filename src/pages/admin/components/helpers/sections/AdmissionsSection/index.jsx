import { Box, Button, Typography } from "@mui/material"
import { useImageUrl } from "@src/hooks/useImageUrl";
import { Clock3, FileText, Mail, MessageSquare, Phone } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import PageRenderer from "../../../builder/Renderer";
import AdmissionsAudioPlayer from "./AdmissionsAudioPlayer";

const AdmissionsSection = ({
      children = []
}) => {

  const { data } = useSelector((state) => state.sections.fetchData.databaseDownload);

  // Obtengo el nombre del colegio
  const name = useMemo(() => {
    return data?.name || "";
  }, [data]);  

  // Obtengo los campos de admisiones
  const admisiones = useMemo(() => {
          try {
              const parsed =
                  data?.admisiones
                      ? JSON.parse(data.admisiones)
                      : {};
              return parsed;
          } catch (error) {
              console.error("Error parseando campo:", error);
              return [];
          }
  }, [data]);

  const photoAdmisiones = useImageUrl(admisiones?.photo) || "";
  const audioAdmisiones = useImageUrl(admisiones?.audio) || "";
  

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "0.5fr 1fr",
        },
        gap: 2,
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
          backgroundColor: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          maxWidth: { xs: "100%", sm: 420 },
          width: "100%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            height: 120,
            background: "linear-gradient(135deg, #d90000 0%, #b80000 100%)",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              left: "50%",
              transform: "translateX(-50%)",
              width: "140%",
              height: 120,
              backgroundColor: "#fff",
              borderTopLeftRadius: "50%",
              borderTopRightRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.12,
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0, #fff 2px, transparent 2px, transparent 14px)",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 148,
            height: 148,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, transparent 0deg, transparent 220deg, #f4a3a3 260deg, #ffd1d1 300deg, #f4a3a3 340deg, transparent 360deg)",
              animation: "spinBorder 3s linear infinite",
              "@keyframes spinBorder": {
                "0%": {
                  transform: "rotate(0deg)",
                },
                "100%": {
                  transform: "rotate(360deg)",
                },
              },
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 3,
              borderRadius: "50%",
              backgroundColor: "#f7f7f7",
            }}
          />

          <Box
            sx={{
              position: "relative",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "4px solid #fff",
              boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
              overflow: "hidden",
              backgroundColor: "#eee",
              zIndex: 2,
            }}
          >
            {photoAdmisiones ? (
              <Box
                component="img"
                src={photoAdmisiones}
                alt={admisiones?.name || "Director de admisiones"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#bdbdbd",
                  fontSize: 42,
                  fontWeight: 700,
                }}
              >
                ?
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            px: 3,
            pt: 10,
            pb: 3,
          }}
        >
          <Box
            sx={{
              width: "fit-content",
              mx: "auto",
              mb: 2,
              px: 2,
              py: 0.75,
              borderRadius: "999px",
              border: "1px solid #efb2b2",
              backgroundColor: "#fff5f5",
              color: "#c60000",
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ● Director de admisiones
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 800,
              color: "#111827",
              fontSize: { xs: "1.6rem", md: "1.9rem" },
              lineHeight: 1.05,
              mb: 1.5,
            }}
          >
            {admisiones?.name || "Nombre del director"}
          </Typography>

          <Box
            sx={{
              borderTop: "1px solid #e5e7eb",
              pt: 2.5,
              display: "grid",
              gap: 1.8,
            }}
          >
            <InfoRow
              icon={<Mail size={18} />}
              label="Correo"
              value={admisiones?.email || "admisiones@colegio.edu.co"}
            />

            <InfoRow
              icon={<Phone size={18} />}
              label="Teléfono / WhatsApp"
              value={admisiones?.phone || "+57 310 000 0000"}
            />

            <InfoRow
              icon={<Clock3 size={18} />}
              label="Horario de atención"
              value={admisiones?.schedule || "Lun – Vie · 7:00 am – 5:00 pm"}
            />

          </Box>

          <Box
            sx={{
              borderTop: "1px solid #e5e7eb",
              mt: 3,
              pt: 2.5,
              display: "grid",
              gap: 1.5,
            }}
          >
            {/* Creo componente interno para el audio */}
            {
              audioAdmisiones.length > 0 ? (
                <AdmissionsAudioPlayer audioUrl={audioAdmisiones} />
              ) : <p>No tiene audio de admisiones, cargué el audio...</p>
            }

            <Button
              variant="outlined"
              startIcon={<FileText size={18} />}
              sx={{
                py: 1.4,
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.98rem",
                color: "#111827",
                borderColor: "#d1d5db",
                backgroundColor: "#fff",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#fafafa",
                },
              }}
            >
              Más información
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Formulario */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 2, md: 4 },
          px: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            backgroundColor: "#fff5f5",
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          
          <Typography
            sx={{
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              fontWeight: 800,
              color: "#d90000",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            {"Proceso de admisiones · 2026"}
          </Typography>

          {/* Título principal */}
          <Typography
            sx={{
              fontWeight: 800,
              color: "#111827",
              fontSize: {
                xs: "1.9rem",
                md: "2.6rem",
              },
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            {`Empieza el camino hacia ${name || "nuestro colegio"}`}
          </Typography>

          {/* Descripción */}
          <Typography
            sx={{
              color: "#4b5563",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "720px",
              mt: 2,
            }}
          >
            {
              "Nuestro proceso de admisión está diseñado para conocer a cada familia y encontrar el mejor encaje académico y de valores. Un equipo dedicado te acompaña en cada paso, desde la primera consulta hasta la bienvenida oficial al colegio."}
          </Typography>
        </Box>

        {children && children.length > 0 && children?.some((child) => child.type === "FormSection") ?  (
                children.filter((child) => child.type === "FormSection")
                .map((child) => (
                  <Box 
                    sx={{ position: "relative", zIndex: 1 }}
                    key={child.id} 
                    className="w-full flex flex-col"
                >
                    <PageRenderer sections={[child]} />
                  </Box>
                ))
            ) : (
              <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                  <Typography className="text-gray-400 font-medium">
                      Marcas vacias: Aquí debe ir el componente de Formulario (FormSection) (+)
                  </Typography>
              </Box>
            )
        }
      </Box>
    </Box>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        alignItems: "center",
        columnGap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          border: "1px solid #f1c4c4",
          backgroundColor: "#fff5f5",
          color: "#d90000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#9ca3af",
            fontWeight: 700,
            mb: 0.2,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 15,
            color: "#1f2937",
            fontWeight: 500,
            lineHeight: 1.35,
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdmissionsSection
