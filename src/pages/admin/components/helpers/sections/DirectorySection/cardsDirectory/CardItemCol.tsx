import { useEffect, useRef, useState } from "react";
import { Avatar, Card, Tooltip, useMediaQuery } from "@mui/material";
import { useComparison } from "../comparison/ComparisonContext";
import { getValue } from "../results/utils";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import StartSection from "../../StartsSection";
import ImgFlagsCountry from "../results/ImgFlagsCountry";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ItemData {
  id?: string;
  _id?: string;
  Nombre?: string;
  Colegio?: string;
  Stars?: number | string;
  Ciudad?: string;
  Departamento?: string;
  "Categoría"?: string;
  "Calificación"?: string;
  "Siglas acreditación"?: string;
  "Siglas certificación"?: string;
  path?: string;
  logo?: string;
  imagen_institucion?: string;
  portadaPhoto?: string;
  portada?: string;
  languages?: string | string[];
  Nuevos?: string;
  rectorName?: string;
  director_foto?: string;
  foto_rector?: string;
  rectorPhoto?: string;
  rectorSocial?: string | Record<string, string>;
  DirectorWeb?: string;
  Vinculada?: string;
  Sec?: string;
  Cal?: string;
  "Orientación religiosa"?: string;
  "Género"?: string;
  Zon?: string;
  "Doble titulación"?: string;
  "Intercambios o salidas internacionales"?: string;
  "Bilingüe"?: string;
  history?: unknown[];
  [key: string]: unknown;
}

interface CardItemColProps {
  item: ItemData;
  primaryColor?: string;
  onOpenHistory?: () => void;
}

interface InfoIcon {
  icon: string;
  label: string;
}

/* ─── Style injection hook ───────────────────────────────────────────────── */

function useCardAnimations(): void {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    if (document.getElementById("card-animations")) {
      injected.current = true;
      return;
    }
    const style = document.createElement("style");
    style.id = "card-animations";
    style.innerHTML = `
            @keyframes starShineLower {
                0%, 100% {
                    filter: drop-shadow(0 0 2px rgba(251,191,36,0.5));
                    transform: scale(1);
                }
                50% {
                    filter: drop-shadow(0 0 7px rgba(251,191,36,0.95))
                            drop-shadow(0 0 14px rgba(251,191,36,0.5));
                    transform: scale(1.12);
                }
            }
            .star-shine > div > span {
                animation: starShineLower 2.5s ease-in-out infinite;
            }
            .star-shine > div > span:nth-child(2) { animation-delay: 0.2s; }
            .star-shine > div > span:nth-child(3) { animation-delay: 0.4s; }
            .star-shine > div > span:nth-child(4) { animation-delay: 0.6s; }
            .star-shine > div > span:nth-child(5) { animation-delay: 0.8s; }
        `;
    document.head.appendChild(style);
    injected.current = true;
  }, []);
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function hexToRgb(hex: string): string {
  let clean = hex.replace("#", "");
  // Expand shorthand (#fff → #ffffff)
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return "192,0,7";
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

function safeParseJson(value: unknown): Record<string, string> | null {
  if (typeof value === "object" && value !== null) return value as Record<string, string>;
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, string>;
    return null;
  } catch {
    return null;
  }
}

function isSafeUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function splitAccreditations(value: unknown): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(/\s*[+/]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeLanguage(lang: unknown): string {
  if (typeof lang !== "string") return "";
  const normalized = lang.trim();
  if (normalized === "Inglés") return "Inglés-A";
  return normalized;
}

function parseLanguages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(normalizeLanguage).filter(Boolean);
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(",")
      .map((l) => normalizeLanguage(l.trim()))
      .filter(Boolean);
  }
  return [];
}

function openWindow(url: string): void {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const BADGE_W = 72;
const BADGE_H = 46;

const BadgeCategoria = ({ category }: { category: string }) => {
  if (!category) return null;
  return (
    <div
      className="flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-red-600 to-red-800"
      style={{
        borderRadius: 10,
        width: BADGE_W,
        height: BADGE_H,
        lineHeight: 1.15,
        border: "1px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(4px)",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
        D{category}
      </span>
      <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.07em", opacity: 0.85 }}>
      categoría
      </span>
    </div>
  );
};

const BadgeCalificacion = ({ qualification }: { qualification: string }) => {
  if (!qualification) return null;
  return (
    <div
      className="flex flex-col items-center justify-center text-center bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 text-yellow-950"
      style={{
        color: "#2d1a00",
        borderRadius: 10,
        width: BADGE_W,
        height: BADGE_H,
        lineHeight: 1.15,
        border: "1px solid rgba(255,255,255,0.25)",
        backdropFilter: "blur(4px)",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.01em" }}>
        {qualification}
      </span>
      <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.07em", opacity: 0.75 }}>
        calificación
      </span>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export const CardItemCol = ({ item, primaryColor, onOpenHistory }: CardItemColProps) => {
  useCardAnimations();

  const [showAllAccreditations, setShowAllAccreditations] = useState(false);
  const { selectedItems, toggleItem } = useComparison();
  const isXs = useMediaQuery("(max-width:380px)");

  const RED = primaryColor || "#c00007";

  /* ── Stable item ID (never JSON.stringify the whole item) ── */
  const itemId = item.id ?? item._id ?? null;
  const isSelected = itemId
    ? selectedItems.some((i: ItemData) => (i.id ?? i._id) === itemId)
    : false;

  /* ── Field accessors ── */
  const getAlias = (column: keyof ItemData): unknown => item[column] ?? "";

  const Vinculada = item.Vinculada;
  const Stars = item.Stars;
  const city = (item.Ciudad as string) || "";
  const department = (item.Departamento as string) || "";
  const category = (item["Categoría"] as string) || "";
  const qualification = (item["Calificación"] as string) || "";
  const accreditationMain = item["Siglas acreditación"];
  const accreditationSec = item["Siglas certificación"];
  const link = getValue(item, ["path"]) as string | undefined;
  const hasLink = isSafeUrl(link) && Vinculada === "Sí";
  const logoColegio = getValue(item, ["logo", "imagen_institucion"]) as string | undefined;
  const portadaPath = getValue(item, ["portadaPhoto", "portada"]) as string | undefined;
  const rawLanguages = item.languages;
  const languages = parseLanguages(rawLanguages);
  const nuevo = (item.Nuevos as string) || "";
  const directorName = getValue(item, ["rectorName"]) as string | undefined;
  const directorPhoto = getValue(item, ["director_foto", "foto_rector", "rectorPhoto"]) as string | undefined;
  const socialRector = item.rectorSocial;

  const socialR = safeParseJson(socialRector);
  const directorWeb = socialR?.linkedin ?? (item.DirectorWeb as string | undefined);

  const accreditations: string[] = [
    ...splitAccreditations(accreditationMain),
    ...splitAccreditations(accreditationSec),
  ];

  const sec = (item.Sec as string) || "";
  const cal = (item.Cal as string) || "";
  const religion = (item["Orientación religiosa"] as string) || "";
  const genero = (item["Género"] as string) || "";
  const zona = (item.Zon as string) || "";
  const dobleTitulacion = item["Doble titulación"];
  const intercambios = item["Intercambios o salidas internacionales"];
  const bilingue = item["Bilingüe"];

  const infoIcons: InfoIcon[] = [
    sec ? { icon: "Building2", label: sec } : null,
    cal ? { icon: "CalendarDays", label: `Calendario ${cal}` } : null,
    religion ? { icon: "Church", label: religion } : null,
    genero ? { icon: "Users", label: genero } : null,
    zona ? { icon: "MapPinned", label: zona } : null,
    dobleTitulacion === "Sí" ? { icon: "GraduationCap", label: "Doble Titulación" } : null,
    intercambios === "Sí" ? { icon: "Plane", label: "Intercambios internacionales" } : null,
    bilingue === "Sí" ? { icon: "Globe", label: "Bilingüe" } : null,
  ].filter((x): x is InfoIcon => x !== null);

  const hasHistory = Array.isArray(item.history) && item.history.length > 0;

  const photoSize = isXs ? 52 : 62;

  /* ── NOT LINKED ── */
  if (Vinculada !== "Sí") {
    return (
      <Card
        sx={{
          borderRadius: "14px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          opacity: 0.5,
          p: "10px 12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 8px",
          alignItems: "center",
        }}
      >
        {category && <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>D{category}</span>}
        {qualification && <span style={{ fontSize: 11, color: "#9ca3af" }}>{qualification}</span>}
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{item.Nombre || item.Colegio || "Sin Nombre"}</span>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>
          {city}{department ? `, ${department}` : ""}
        </span>
      </Card>
    );
  }

  /* ── LINKED ── */
  return (
    <Card
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        border: isSelected ? `2px solid ${RED}` : "1px solid #e5e7eb",
        boxShadow: isSelected
          ? `0 0 0 3px ${RED}22`
          : "0 3px 12px rgba(0,0,0,0.08)",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 10px 28px rgba(0,0,0,0.13)",
          transform: "translateY(-2px)",
        },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      {/* ══ IMAGE ZONE ══ */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: isXs ? 178 : 202,
          background: `linear-gradient(160deg, rgba(15,10,30,0.92) 0%, rgba(${hexToRgb(RED)},0.55) 50%, rgba(10,8,20,0.97) 100%)`,
        }}
      >
        {/* Red glow top-left */}
        <div
          style={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${RED}55 0%, transparent 68%)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Portada / gradient bg */}
        {portadaPath ? (
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <StorageImage
              alt={item.Nombre || item.Colegio || "portada"}
              path={portadaPath}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.65) saturate(1.1)",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: `linear-gradient(160deg, rgba(15,10,30,0.92) 0%, rgba(${hexToRgb(RED)},0.55) 50%, rgba(10,8,20,0.97) 100%)`,
            }}
          />
        )}

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.16) 38%, rgba(0,0,0,0.80) 100%)",
          }}
        />

        {/* ── TOP ROW ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            padding: "10px 10px 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          {/* Left: Comparar + Micrositio */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => toggleItem(item)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                backgroundColor: isSelected
                  ? `${RED}cc`
                  : "rgba(255,255,255,0.18)",
                color: "#fff",
                fontSize: isXs ? 9 : 10,
                padding: "4px 9px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(6px)",
                cursor: "pointer",
                lineHeight: 1,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              <DynamicIcon name="AlignJustify" color="#fff" size={9} />
              Comparar
            </button>

            {hasLink && link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontSize: isXs ? 9 : 10,
                  padding: "4px 9px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.35)",
                  backdropFilter: "blur(6px)",
                  lineHeight: 1,
                  fontWeight: 600,
                  flexShrink: 0,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <DynamicIcon name="ExternalLink" color="#fff" size={9} />
                Micrositio
              </a>
            )}
            {item["Aniversario"] && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontSize: isXs ? 9 : 10,
                  padding: "4px 9px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.35)",
                  backdropFilter: "blur(6px)",
                  lineHeight: 1,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <DynamicIcon name="CalendarClock" color="#fff" size={9} />
                {item["Aniversario"] as React.ReactNode}
              </div>
            )}


          </div>

          {/* Right: Badges */}
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <BadgeCategoria category={category} />
            <BadgeCalificacion qualification={qualification} />
          </div>
        </div>

        {/* ── BOTTOM CONTENT ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            padding: "0 10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {/* Stars */}
          <div className="star-shine" style={{ display: "inline-flex" }}>
            <StartSection
              excelSource=""
              stars={Stars}
              typePage="admin"
              size={isXs ? 14 : 17}
              gap={3}
            />
          </div>

          {/* School name */}
          <span
            onClick={() => hasLink && link && openWindow(link)}
            style={{
              fontSize: isXs ? "0.95rem" : "1.05rem",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              cursor: hasLink ? "pointer" : "default",
              display: "block",
            }}
          >
            {item.Nombre || item.Colegio || "Sin Nombre"}
          </span>

          {/* Ubicación */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              minWidth: 0,
              flexWrap: "nowrap",
            }}
          >
            <DynamicIcon
              name="MapPin"
              color="rgba(255,255,255,0.70)"
              size={11}
            />
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 1,
              }}
            >
              {city}
              {department ? ` , ${department}` : ""}
            </span>
          </div>

          {/* Info icons & Flags Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Info icons */}
            {infoIcons.length > 0 ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {infoIcons.map((info, i) => (
                  <Tooltip key={i} title={info.label} arrow>
                    <div
                      className="transition-colors duration-200"
                      style={{
                        width: 27,
                        height: 27,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(255,255,255,0.28)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <DynamicIcon
                        name={info.icon}
                        color="rgba(255,255,255,0.90)"
                        size={13}
                      />
                    </div>
                  </Tooltip>
                ))}
              </div>
            ) : (
              <div />
            )}

            {/* Banderas */}
            {languages.length > 0 && (
              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                <DynamicIcon
                  name="Languages"
                  color="rgba(255,255,255,0.70)"
                  size={13}
                />
                {languages.map((lang, idx) => (
                  <div
                    key={`flag_${idx}`}
                    className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-full border border-white/35 bg-white/10 shadow-sm shadow-black/10 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:border-white/70 hover:shadow-md hover:shadow-black/20"
                  >
                    <div className="scale-[1.75]">
                      <ImgFlagsCountry
                        languages={[lang]}
                        size={18}
                        gap="0px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ BOTTOM — rector / respaldos ══ */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "12px",
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: "0 10px",
          alignItems: "stretch",
          position: "relative",
        }}
      >
        {/* ── Rector ── */}
        <div className="flex flex-col items-center gap-1">
          <div style={{ position: "relative" }}>
            {directorPhoto ? (
              <div
                style={{
                  width: photoSize,
                  height: photoSize,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${RED}44`,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.11)",
                }}
              >
                <StorageImage
                  alt={directorName ?? "Rector"}
                  path={directorPhoto}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <Avatar
                sx={{
                  width: photoSize,
                  height: photoSize,
                  border: `2px solid ${RED}44`,
                }}
              />
            )}

            {logoColegio && (
              <div
                style={{
                  position: "absolute",
                  bottom: -3,
                  right: -3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #fff",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
                }}
              >
                <StorageImage
                  alt="logo"
                  path={logoColegio}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          <span
            style={{
              fontSize: 9,
              color: "#9ca3af",
              fontWeight: 500,
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            Rectoría
          </span>

          {directorName && (
            <a
              href={isSafeUrl(directorWeb) ? directorWeb : "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: isXs ? 10 : 11,
                fontWeight: 700,
                color: "#1f2937",
                textDecoration: "none",
                textAlign: "center",
                lineHeight: 1.25,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {directorName}
            </a>
          )}
        </div>

        {/* ── Divider vertical ── */}
        <div style={{ background: "#f0f0f0", alignSelf: "stretch" }} />

        {/* ── Respaldos ── */}
        <div
          className="flex flex-col"
          style={{
            gap: 6,
            paddingBottom: (nuevo || (onOpenHistory && hasHistory)) ? 32 : 4,
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#6b7280",
              letterSpacing: "0.05em",
              lineHeight: 1,
              marginBottom: 5,
            }}
          >
            Respaldos
          </span>

          {accreditations.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: showAllAccreditations ? "wrap" : "nowrap",
                overflow: "hidden",
                gap: "4px 5px",
              }}
            >
              {(showAllAccreditations
                ? accreditations
                : accreditations.slice(0, 2)
              ).map((acc, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#991b1b",
                    border: "1px solid #fecaca",
                    borderRadius: 6,
                    fontSize: isXs ? 9 : 10,
                    fontWeight: 600,
                    padding: "3px 7px",
                    lineHeight: 1.35,
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                >
                  {acc}
                </span>
              ))}
              {!showAllAccreditations && accreditations.length > 2 && (
                <span
                  onClick={() => setShowAllAccreditations(true)}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#4b5563",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: isXs ? 9 : 10,
                    fontWeight: 700,
                    padding: "3px 7px",
                    lineHeight: 1.35,
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  +{accreditations.length - 2}
                </span>
              )}
              {showAllAccreditations && accreditations.length > 2 && (
                <span
                  onClick={() => setShowAllAccreditations(false)}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#4b5563",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: isXs ? 9 : 10,
                    fontWeight: 700,
                    padding: "3px 7px",
                    lineHeight: 1.35,
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  —
                </span>
              )}
            </div>
          ) : (
            <span
              style={{ fontSize: 10, color: "#d1d5db", fontStyle: "italic" }}
            >
              —
            </span>
          )}

          {nuevo && (
            <div style={{ position: "absolute", bottom: 2, left: 0 }}>
              <span
                style={{
                  backgroundColor: "rgb(21, 128, 61)",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: 6,
                  lineHeight: 1.2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                }}
              >
                {nuevo}
              </span>
            </div>
          )}
        </div>

        {/* ── Botón historial ── */}
        {onOpenHistory && hasHistory && (
          <button
            type="button"
            onClick={onOpenHistory}
            aria-label="Ver historial"
            className="group cursor-pointer absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200/60 active:scale-95"
          >
            <DynamicIcon name="History" color="currentColor" size={14} />
            <span className="pointer-events-none absolute right-full top-1/2 mr-2 min-w-[92px] -translate-y-1/2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-center text-[11px] font-semibold text-red-800 opacity-0 shadow-lg shadow-red-100/60 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:opacity-100">
              Ver historial
            </span>
          </button>
        )}
      </div>
    </Card>
  );
};
