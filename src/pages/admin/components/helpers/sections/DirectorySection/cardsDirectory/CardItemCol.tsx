import { Avatar, Card, Tooltip, useMediaQuery } from "@mui/material";
import { useComparison } from "../comparison/ComparisonContext";
import { getValue } from "../results/utils";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import ImgFlagsCountry from "../results/ImgFlagsCountry";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

/* ─── Keyframes inyectados una sola vez ───────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("card-animations")) {
    const style = document.createElement("style");
    style.id = "card-animations";
    style.innerHTML = `
        @keyframes starShineLower {
            0%, 100% { filter: drop-shadow(0 0 1px rgba(251, 191, 36, 0.3)); transform: scale(1); }
            50% { filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.5)); transform: scale(1.08); }
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
}

export const CardItemCol = ({ item, primaryColor, onOpenHistory }) => {
    const { selectedItems, toggleItem } = useComparison();
    const isXs = useMediaQuery("(max-width:380px)");

    const RED = primaryColor || "#c00007";

    const itemId     = item.id || item._id || JSON.stringify(item);
    const isSelected = selectedItems.some(
        (i) => (i.id || i._id || JSON.stringify(i)) === itemId
    );

    const getAlias = (column) => {
        if (item[column] !== undefined && item[column] !== null) return item[column];
        return "";
    };

    const Vinculada         = getValue(item, ["Vinculada"]);
    const Stars             = getAlias("Stars");
    const city              = getAlias("Ciudad");
    const department        = getAlias("Departamento");
    const category          = getAlias("Categoría");
    const qualification     = getAlias("Calificación");
    const accreditationMain = getAlias("Siglas acreditación");
    const accreditationSec  = getAlias("Siglas certificación");
    const link              = getValue(item, ["path"]);
    const hasLink           = Boolean(link) && Vinculada;
    const logoColegio       = getValue(item, ["logo", "imagen_institucion"]);
    const portadaPath       = getValue(item, ["portadaPhoto", "portada"]);
    const rawLanguages      = getAlias("languages");

    const normalizeLanguage = (lang) => {
        const normalized = lang.trim();
        if (normalized === "Inglés") return "Inglés-A";
        return normalized;
    };

    const languages         = Array.isArray(rawLanguages)
        ? rawLanguages.map(normalizeLanguage)
        : (typeof rawLanguages === 'string'
            ? rawLanguages.split(',').map(l => normalizeLanguage(l))
            : []);
    const nuevo             = getAlias("Nuevos");
    const directorName      = getValue(item, ["rectorName"]);
    const directorPhoto     = getValue(item, ["director_foto", "foto_rector", "rectorPhoto"]);
    const socialRector      = getValue(item, ["rectorSocial"]);

    const sec             = getAlias("Sec");
    const cal             = getAlias("Cal");
    const religion        = getAlias("Orientación religiosa");
    const genero          = getAlias("Género");
    const zona            = getAlias("Zon");
    const dobleTitulacion = getAlias("Doble titulación");
    const intercambios    = getAlias("Intercambios o salidas internacionales");
    const bilingue        = getAlias("Bilingüe");

    let socialR;
    if (socialRector) {
        socialR = typeof socialRector === "string" ? JSON.parse(socialRector) : socialRector;
    }
    const directorWeb = socialR?.linkedin ?? getAlias("DirectorWeb");

    const accreditations = [
        ...(accreditationMain
            ? accreditationMain.split(/\s*[\+\/]\s*/).map((s) => s.trim()).filter(Boolean)
            : []),
        ...(accreditationSec
            ? accreditationSec.split(/\s*[\+\/]\s*/).map((s) => s.trim()).filter(Boolean)
            : []),
    ];

    const infoIcons = [
        sec       && { icon: "Building2",    label: sec },
        cal       && { icon: "CalendarDays", label: `Calendario ${cal}` },
        religion  && { icon: "Church",       label: religion },
        genero    && { icon: "Users",        label: genero },
        zona      && { icon: "MapPinned",    label: zona },
        dobleTitulacion === "Sí" && { icon: "GraduationCap", label: "Doble Titulación" },
        intercambios    === "Sí" && { icon: "Plane",         label: "Intercambios internacionales" },
        bilingue        === "Sí" && { icon: "Globe",         label: "Bilingüe" },
    ].filter(Boolean);

    // ── NOT LINKED ───────────────────────────────────────────────────────────
    if (Vinculada !== "Sí") {
        return (
            <Card sx={{
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                opacity: 0.5,
                p: "10px 12px",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 8px",
                alignItems: "center",
            }}>
                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>D{category}</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{qualification}</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{item.Nombre || item.Colegio || "Sin Nombre"}</span>
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{city}{department ? `, ${department}` : ""}</span>
            </Card>
        );
    }

    // ── LINKED ───────────────────────────────────────────────────────────────
    const photoSize = isXs ? 52 : 62;

    return (
        <Card sx={{
            borderRadius: "16px",
            overflow: "hidden",
            border: isSelected ? `2px solid ${RED}` : "1px solid #e5e7eb",
            boxShadow: isSelected ? `0 0 0 3px ${RED}22` : "0 3px 12px rgba(0,0,0,0.08)",
            transition: "all 0.25s ease",
            "&:hover": {
                boxShadow: "0 10px 28px rgba(0,0,0,0.13)",
                transform: "translateY(-2px)",
            },
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            width: "100%",
        }}>

            {/* ══════════════════════════════════════════
                IMAGE ZONE
            ══════════════════════════════════════════ */}
            <div style={{ position: "relative", overflow: "hidden", minHeight: isXs ? 195 : 220 }}>

                {/* Red glow — top-left corner, subtle */}
                <div style={{
                    position: "absolute",
                    top: -30, left: -30,
                    width: 140, height: 140,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${RED}55 0%, transparent 68%)`,
                    zIndex: 2,
                    pointerEvents: "none",
                }} />

                {/* Portada / gradient bg */}
                {portadaPath ? (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                        <StorageImage
                            alt={item.Nombre || item.Colegio || "portada"}
                            path={portadaPath}
                            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(1.1)" }}
                        />
                    </div>
                ) : (
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 0,
                        background: `linear-gradient(160deg, rgba(15,10,30,0.92) 0%, rgba(${hexToRgb(RED)},0.55) 50%, rgba(10,8,20,0.97) 100%)`,
                    }} />
                )}

                {/* Dark overlay */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 1,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.16) 38%, rgba(0,0,0,0.80) 100%)",
                }} />

                {/* ── TOP ROW ── */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    zIndex: 3, padding: "10px 10px 0",
                    display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", gap: 6,
                }}>
                    {/* Left: Comparar + Micrositio */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                            onClick={() => toggleItem?.(item)}
                            className="flex items-center gap-1 font-semibold transition-all duration-200 hover:opacity-90 flex-shrink-0"
                            style={{
                                backgroundColor: isSelected ? `${RED}cc` : "rgba(255,255,255,0.18)",
                                color: "#fff",
                                fontSize: isXs ? 9 : 10,
                                padding: "4px 9px",
                                borderRadius: 999,
                                border: "1px solid rgba(255,255,255,0.35)",
                                backdropFilter: "blur(6px)",
                                cursor: "pointer",
                                lineHeight: 1,
                            }}
                        >
                            <DynamicIcon name="AlignJustify" color="#fff" size={9} />
                            Comparar
                        </button>

                        {hasLink && (
                            <a
                                href={link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 font-semibold no-underline transition-all duration-200 hover:opacity-90 flex-shrink-0"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.18)",
                                    color: "#fff",
                                    fontSize: isXs ? 9 : 10,
                                    padding: "4px 9px", borderRadius: 999,
                                    border: "1px solid rgba(255,255,255,0.35)",
                                    backdropFilter: "blur(6px)", lineHeight: 1,
                                }}
                            >
                                <DynamicIcon name="ExternalLink" color="#fff" size={9} />
                                Micrositio
                            </a>
                        )}
                    </div>

                    {/* Right: Badges */}
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                        <BadgeCategoria category={category} RED={RED} />
                        {qualification && <BadgeCalificacion qualification={qualification} />}
                    </div>
                </div>

                {/* ── BOTTOM CONTENT ── */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    zIndex: 3, padding: "0 10px 12px",
                    display: "flex", flexDirection: "column", gap: 8,
                }}>
                    {/* Stars con animación de brillo */}
                    <div className="star-shine" style={{ display: "inline-flex" }}>
                        <StartSection
                            excelSource="" stars={Stars} typePage="admin"
                            size={isXs ? 14 : 17} gap={3}
                        />
                    </div>

                    {/* School name */}
                    <span
                        onClick={() => hasLink && window.open(link, "_blank")}
                        style={{
                            fontSize: isXs ? "0.95rem" : "1.05rem",
                            fontWeight: 800, color: "#fff",
                            lineHeight: 1.2, letterSpacing: "-0.01em",
                            cursor: hasLink ? "pointer" : "default",
                            display: "block",
                        }}
                    >
                        {item.Nombre || item.Colegio || "Sin Nombre"}
                        {nuevo && nuevo.length > 0 && (
                            <span style={{
                                marginLeft: 6, backgroundColor: RED, color: "#fff",
                                fontSize: 8, fontWeight: 700, padding: "2px 5px",
                                borderRadius: 6, verticalAlign: "middle",
                            }}>{nuevo}</span>
                        )}
                    </span>

                    {/* ── Ubicación + banderas en la misma fila ── */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        minWidth: 0,
                        flexWrap: "nowrap",
                    }}>
                        <DynamicIcon name="MapPin" color="rgba(255,255,255,0.70)" size={11} />
                        <span style={{
                            fontSize: 11, color: "rgba(255,255,255,0.75)",
                            lineHeight: 1, whiteSpace: "nowrap",
                            overflow: "hidden", textOverflow: "ellipsis",
                            flexShrink: 1,
                        }}>
                            {city}{department ? ` , ${department}` : ""}
                        </span>
                        {languages && languages.length > 0 && (
                            <ImgFlagsCountry
                                languages={languages}
                                size={15}
                                gap="3px"
                            />
                        )}
                    </div>

                    {/* Info icons */}
                    {infoIcons.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {infoIcons.map((info, i) => (
                                <Tooltip key={i} title={info.label} arrow>
                                    <div style={{
                                        width: 27, height: 27, borderRadius: "50%",
                                        backgroundColor: "rgba(255,255,255,0.15)",
                                        border: "1px solid rgba(255,255,255,0.28)",
                                        backdropFilter: "blur(6px)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer", transition: "background 0.2s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.28)"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
                                    >
                                        <DynamicIcon name={info.icon} color="rgba(255,255,255,0.90)" size={13} />
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════
                BOTTOM — mitad rector / mitad respaldos
            ══════════════════════════════════════════ */}
            <div style={{
                backgroundColor: "#fff",
                padding: "12px 12px",
                display: "grid",
                gridTemplateColumns: "1fr 1px 1fr",
                gap: "0 10px",
                alignItems: "center",
                minHeight: 0,
                position: "relative",
            }}>

                {/* ── Rector (mitad izquierda) ── */}
                <div className="flex flex-col items-center" style={{ gap: 4 }}>
                    <div className="relative">
                        {directorPhoto ? (
                            <div style={{
                                width: photoSize, height: photoSize,
                                borderRadius: "50%", overflow: "hidden",
                                border: `2px solid ${RED}44`,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.11)",
                            }}>
                                <StorageImage
                                    alt={directorName} path={directorPhoto}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        ) : (
                            <Avatar sx={{ width: photoSize, height: photoSize, border: `2px solid ${RED}44` }} />
                        )}

                        {logoColegio && (
                            <div style={{
                                position: "absolute", bottom: -3, right: -3,
                                width: 20, height: 20, borderRadius: "50%",
                                overflow: "hidden", border: "2px solid #fff",
                                backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
                            }}>
                                <StorageImage
                                    alt="logo" path={logoColegio}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>

                    <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1 }}>
                        Rectoría
                    </span>
                    <a
                        href={directorWeb || "#"} target="_blank" rel="noopener noreferrer"
                        style={{
                            fontSize: isXs ? 10 : 11, fontWeight: 700,
                            color: "#1f2937", textDecoration: "none",
                            textAlign: "center", lineHeight: 1.25,
                        }}
                        className="hover:underline"
                    >
                        {directorName}
                    </a>
                </div>

                {/* ── Divider vertical ── */}
                <div style={{ background: "#f0f0f0", alignSelf: "stretch" }} />

                {/* ── Respaldos (mitad derecha) ── */}
                {accreditations.length > 0 ? (
                    <div className="flex flex-col relative" style={{ gap: 5 }}>
                        <span style={{
                            fontSize: 9, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1,
                            position: "absolute", top: "-22px", left: 0,
                        }}>
                            Respaldos
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 5px" }}>
                            {accreditations.map((acc, i) => (
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
                                    }}
                                >
                                    {acc}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div />
                )}

                {/* ── Historial (esquina absoluta) ── */}
                {onOpenHistory && item.history?.length > 0 && (
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center justify-center p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
                        style={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            cursor: 'pointer',
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        }}
                        title="Ver historial"
                    >
                        <DynamicIcon name="History" color="#9ca3af" size={16} />
                    </button>
                )}
            </div>
        </Card>
    );
};

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
}

/* ─── Sub-components ────────────────────────────────────────────────────────── */

const BADGE_W = 72;
const BADGE_H = 46;

const BadgeCategoria = ({ category, RED }) => (
    <div
        className="flex flex-col items-center justify-center text-center text-white"
        style={{
            background: "linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #b91c1c 100%)",
            borderRadius: 10,
            width: BADGE_W, height: BADGE_H,
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
            Categoría
        </span>
    </div>
);

const BadgeCalificacion = ({ qualification }) => (
    <div
        className="flex flex-col items-center justify-center text-center"
        style={{
            background: "linear-gradient(135deg, #7c4a03 0%, #d4a843 45%, #f5c842 70%, #7c4a03 100%)",
            color: "#2d1a00",
            borderRadius: 10,
            width: BADGE_W, height: BADGE_H,
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
            Calificación
        </span>
    </div>
);