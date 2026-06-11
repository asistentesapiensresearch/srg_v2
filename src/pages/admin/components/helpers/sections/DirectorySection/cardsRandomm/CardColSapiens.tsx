import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

export const CardColSapiens = ({ props }) => {
  const logo        = useImageUrl(props?.logo)        || "";
  const portada     = useImageUrl(props?.portadaPhoto) || "";
  const rectorPhoto = useImageUrl(props?.rectorPhoto)  || "";

  const ciudad      = props["Ciudad"]      || "";
  const departamento = props["Departamento"] || "";
  const categoria   = props["Categoría"]   || "";
  const calificacion = props["Calificación"] || "";
  const nombre      = props["Colegios"]    || "Sin nombre";
  const stars       = props["Stars"];
  const path        = props.path           || "#";
  const rectorName  = props.rectorName     || "";

  return (
    <>
      <style>
        {`
          @keyframes starPulse {
            0%, 100% {
              filter: drop-shadow(0 0 2px #fbbf24) drop-shadow(0 0 5px #f59e0b);
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0 0 5px #fde68a) drop-shadow(0 0 10px #fbbf24);
              transform: scale(1.2);
            }
          }
          .sg {
            display: inline-block;
            animation: starPulse 2.4s ease-in-out infinite;
          }
          .sg:nth-child(2) { animation-delay: 0.2s; }
          .sg:nth-child(3) { animation-delay: 0.4s; }
          .sg:nth-child(4) { animation-delay: 0.6s; }
        `}
      </style>
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          aspectRatio: "4 / 3",
          minHeight: 240,
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.025)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.38)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.28)";
        }}
      >

        {/* ── Background image ───────────────────────────────────── */}
        {portada ? (
          <img
            src={portada}
            alt={nombre}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", zIndex: 0,
              filter: "brightness(0.65) saturate(1.1)",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)",
          }} />
        )}

        {/* ── Overlay gradient ───────────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.75) 100%)",
        }} />

        {/* ══════════════════════════════════════════════════════════
            TOP ROW — Micrositio + D1 + AAA+
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          zIndex: 3,
          padding: "12px 12px 0",
          display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
        }}>

          {/* Micrositio pill */}
          <div style={{
            backgroundColor: "#c10007",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "5px 13px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(6px)",
            letterSpacing: "0.03em",
            lineHeight: 1,
            textTransform: "uppercase",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            Micrositio
          </div>

          {/* D1 / CATEGORÍA */}
          <div style={{
            background: "linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #b91c1c 100%)",
            color: "#fff",
            borderRadius: 10,
            padding: "4px 11px",
            minWidth: 50,
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            lineHeight: 1.15,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              D{categoria}
            </div>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", opacity: 0.85 }}>
              Categoría
            </div>
          </div>

          {/* AAA+ / CALIFICACIÓN — gold */}
          <div style={{
            background: "linear-gradient(135deg, #7c4a03 0%, #d4a843 45%, #f5c842 70%, #7c4a03 100%)",
            color: "#2d1a00",
            borderRadius: 10,
            padding: "4px 11px",
            minWidth: 54,
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(6px)",
            lineHeight: 1.15,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {calificacion}
            </div>
            <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", opacity: 0.72 }}>
              Calificación
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            BOTTOM ZONE — Stars+Name+Location (left) | Rector (right)
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          zIndex: 3,
          padding: "0 12px 14px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 10,
        }}>

          {/* Left: Stars + Name + Location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 5 }}>
              <StartSection
                excelSource=""
                stars={stars}
                typePage="admin"
                size={28}
                gap={4}
              />
            </div>
            <div style={{
              fontSize: "clamp(14px, 3.5vw, 19px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              marginBottom: 4,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}>
              {nombre}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              color: "rgba(255,255,255,0.75)", fontSize: 11,
            }}>
              <DynamicIcon name="MapPin" color="rgba(255,255,255,0.65)" size={12} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {ciudad}{departamento ? `, ${departamento}` : ""}
              </span>
            </div>
          </div>

          {/* Right: Rector photo + label + name */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            flexShrink: 0, gap: 3,
          }}>
            {/* Photo with logo badge */}
            <div style={{ position: "relative" }}>
              {rectorPhoto ? (
                <img
                  src={rectorPhoto}
                  alt={rectorName}
                  style={{
                    width: 80, height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2.5px solid rgba(255,255,255,0.55)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    display: "block",
                  }}
                />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  backgroundColor: "#4b5563",
                  border: "2.5px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                }} />
              )}

              {/* School logo badge */}
              {logo && (
                <div style={{
                  position: "absolute", bottom: -3, right: -4,
                  width: 22, height: 22, borderRadius: "50%", overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.55)",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}>
                  <img src={logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>

            {/* Label + Name */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 9, color: "rgba(255,255,255,0.58)",
                fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1,
              }}>
                Rectoría
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#fff",
                lineHeight: 1.25, maxWidth: 80, textAlign: "center",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}>
                {rectorName}
              </div>
            </div>
          </div>
        </div>
      </div>
      </a>
    </>
  );
};