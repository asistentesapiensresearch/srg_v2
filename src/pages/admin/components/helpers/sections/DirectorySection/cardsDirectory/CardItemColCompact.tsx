import { useState } from "react";
import { Avatar } from "@mui/material";
import { useComparison } from "../comparison/ComparisonContext";
import { getValue } from "../results/utils";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { MapPin } from "lucide-react";
import StartSection from "../../StartsSection";
import ImgFlagsCountry from "../results/ImgFlagsCountry";

export const CardItemColCompact = ({ item, primaryColor }) => {
  const { selectedItems, toggleItem } = useComparison();
  const RED = primaryColor || "#c00007";

  const itemId = item.id || item._id || JSON.stringify(item);
  const isSelected = selectedItems.some(
    (i) => (i.id || i._id || JSON.stringify(i)) === itemId,
  );

  const getAlias = (col) =>
    item[col] !== undefined && item[col] !== null ? item[col] : "";

  const [hovered, setHovered] = useState(false);

  const Vinculada = getValue(item, ["Vinculada"]);
  const Stars = getAlias("Stars");
  const city = getAlias("Ciudad");
  const department = getAlias("Departamento");
  const category = getAlias("Categoría");
  const qualification = getAlias("Calificación");
  const directorName = getValue(item, ["rectorName"]);
  const directorPhoto = getValue(item, [
    "director_foto",
    "foto_rector",
    "rectorPhoto",
  ]);
  const logoColegio = getValue(item, ["logo", "imagen_institucion"]);
  const link = getValue(item, ["path"]);
  const languages = getAlias("languages");
  const hasLink = Boolean(link) && Vinculada;
  const isNotLinked = Vinculada !== "Sí";
  const nombre = item.Nombre || item.Colegio || "Sin Nombre";

  // ── NOT LINKED ────────────────────────────────────────────────────────────
  if (isNotLinked) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          backgroundColor: "#f3f4f6",
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: hovered ? 1 : 0.55,
          filter: hovered ? "grayscale(20%)" : "grayscale(100%)",
          border: "1px solid #e5e7eb",
          boxShadow: hovered
            ? "0 8px 20px rgba(220,38,38,.15)"
            : "0 2px 6px rgba(0,0,0,0.05)",
          transition: "all .25s ease",
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            border: "2px solid #d1d5db",
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "#9ca3af",
              lineHeight: 1.25,
              marginBottom: 2,
            }}
          >
            {nombre}
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <MapPin size={10} />
            {city}
            {department ? `, ${department}` : ""}
          </div>
        </div>

        {category && (
          <span
            style={{
              fontSize: 12,
              color: "#9ca3af",
              backgroundColor: "#e5e7eb",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            D{category}
          </span>
        )}

        {qualification && (
          <span
            style={{
              fontSize: 12,
              color: "#9ca3af",
              backgroundColor: "#e5e7eb",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            {qualification}
          </span>
        )}

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            overflow: "hidden",

            background:
              "linear-gradient(135deg, rgba(254,242,242,.96) 0%, rgba(255,255,255,.92) 100%)",

            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

            textAlign: "center",
            padding: 20,

            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(1.05)",

            transition: "all .35s cubic-bezier(.22,.61,.36,1)",

            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          {/* Glow superior */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(220,38,38,.25) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          {/* Glow inferior */}
          <div
            style={{
              position: "absolute",
              bottom: -100,
              left: -100,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(239,68,68,.18) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Líneas diagonales */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `
        repeating-linear-gradient(
          135deg,
          rgba(220,38,38,.035) 0px,
          rgba(220,38,38,.035) 2px,
          transparent 2px,
          transparent 18px
        )
      `,
            }}
          />

          {/* Shine Animation */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: hovered ? "140%" : "-140%",
              width: 140,
              height: "180%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)",
              transform: "rotate(25deg)",
              transition: "left 1s ease",
            }}
          />

          {/* Borde brillante */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 14,
              border: "1px solid rgba(220,38,38,.20)",
              boxShadow:
                "inset 0 0 30px rgba(220,38,38,.08), 0 0 25px rgba(220,38,38,.06)",
            }}
          />

          {/* Título */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#991b1b",
              marginBottom: 8,
              maxWidth: 260,
              zIndex: 2,
            }}
          >
            Tu colegio aún no es aliado de Sapiens Research
          </div>

          {/* CTA */}
          <div
            style={{
              color: "#dc2626",
              fontSize: 13,
              zIndex: 2,
            }}
          >
            Conoce los beneficios de vincularse.
          </div>
        </div>
      </div>
    );
  }

  // ── LINKED ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => hasLink && window.open(link, "_blank")}
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, rgb(107, 0, 3) 0%, rgb(168, 0, 6) 35%, rgb(144, 0, 5) 65%, rgb(74, 0, 2) 100%)",
        borderRadius: 16,
        padding: "12px 12px 10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: hasLink ? "pointer" : "default",
        border: isSelected
          ? "2px solid rgba(255,255,255,0.55)"
          : "1px solid rgba(255,180,180,0.10)",
        boxShadow: isSelected
          ? `0 0 0 3px ${RED}55, 0 8px 32px rgba(50,0,0,0.55)`
          : "0 6px 28px rgba(30,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.15)",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 14px 40px rgba(20,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.09)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 6px 28px rgba(30,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.15)";
      }}
    >
      {/* ── Background texture: + sparkles ──────────────────────── */}
      {[
        { top: "12%", left: "28%", size: 13, opacity: 0.13 },
        { top: "18%", left: "55%", size: 10, opacity: 0.1 },
        { top: "55%", left: "38%", size: 11, opacity: 0.09 },
        { top: "70%", left: "62%", size: 14, opacity: 0.11 },
        { top: "38%", left: "80%", size: 9, opacity: 0.08 },
        { top: "80%", left: "20%", size: 10, opacity: 0.1 },
      ].map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            fontSize: s.size,
            color: `rgba(255,255,255,${s.opacity})`,
            fontWeight: 300,
            pointerEvents: "none",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          +
        </span>
      ))}

      {/* Radial glow top-right */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,80,80,0.13) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP ROW: Photo + Name/Location + Badges ─────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Photo */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {directorPhoto ? (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2.5px solid rgba(255,255,255,0.50)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.30)",
              }}
            >
              <StorageImage
                alt={directorName}
                path={directorPhoto}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <Avatar
              sx={{
                width: 56,
                height: 56,
                border: "2.5px solid rgba(255,255,255,0.40)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
            />
          )}
          {/* School logo badge */}
          {logoColegio && (
            <div
              style={{
                position: "absolute",
                bottom: -3,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.55)",
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.22)",
              }}
            >
              <StorageImage
                alt="logo"
                path={logoColegio}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        {/* Name + location */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.22,
              letterSpacing: "-0.01em",
              marginBottom: 4,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {nombre}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              color: "rgba(255,255,255,0.72)",
              fontSize: 11,
            }}
          >
            <MapPin size={11} color="rgba(255,255,255,0.65)" />
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {city}
              {department ? `, ${department}` : ""}
            </span>
          </div>
        </div>

        {/* Badges: D1 stacked over AAA+ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          {category && (
            <div
              style={{
                backgroundColor: "rgba(180,0,0,0.80)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 9,
                padding: "4px 10px",
                fontSize: 14,
                fontWeight: 900,
                textAlign: "center",
                lineHeight: 1.1,
                backdropFilter: "blur(4px)",
                minWidth: 46,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              D{category}
            </div>
          )}
          {qualification && (
            <div
              style={{
                background: "linear-gradient(135deg, #f5c518 0%, #c8960c 100%)",
                color: "#2d1a00",
                borderRadius: 9,
                padding: "4px 10px",
                fontSize: 14,
                fontWeight: 900,
                textAlign: "center",
                lineHeight: 1.1,
                minWidth: 46,
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              {qualification}
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM ROW: Director name (left) + Stars (right) ─────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 9,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1,
          }}
        >
          {directorName || ""}
        </span>

        <StartSection
          excelSource=""
          stars={Stars}
          typePage="admin"
          size={15}
          gap={2}
        />
      </div>
    </div>
  );
};
