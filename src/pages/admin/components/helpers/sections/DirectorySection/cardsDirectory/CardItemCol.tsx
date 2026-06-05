import { Avatar, Card, Tooltip, useMediaQuery } from "@mui/material";
import { useComparison } from "../comparison/ComparisonContext";
import { getValue } from "../results/utils";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import ImgFlagsCountry from "../results/ImgFlagsCountry";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

export const CardItemCol = ({ item, primaryColor }) => {
    const { selectedItems, toggleItem } = useComparison();
    const isXs = useMediaQuery("(max-width:380px)");

    const RED = primaryColor || "#c00007";

    const itemId   = item.id || item._id || JSON.stringify(item);
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
    const languages         = getAlias("languages");
    const nuevo             = getAlias("Nuevos");
    const directorName      = getValue(item, ["rectorName"]);
    const directorPhoto     = getValue(item, ["director_foto", "foto_rector", "rectorPhoto"]);
    const socialRector      = getValue(item, ["rectorSocial"]);

    // Info icons data
    const sec               = getAlias("Sec");
    const cal               = getAlias("Cal");
    const religion          = getAlias("Orientación religiosa");
    const genero            = getAlias("Género");
    const zona              = getAlias("Zon");
    const dobleTitulacion   = getAlias("Doble titulación");
    const intercambios      = getAlias("Intercambios o salidas internacionales");
    const bilingue          = getAlias("Bilingüe");

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

    // ── NOT LINKED ───────────────────────────────────────────────────────────────
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

    // ── LINKED ───────────────────────────────────────────────────────────────────
    return (
        <Card sx={{
            borderRadius: "18px",
            overflow: "hidden",
            border: isSelected ? `2px solid ${RED}` : "1px solid #e5e7eb",
            boxShadow: isSelected ? `0 0 0 3px ${RED}22` : "0 4px 16px rgba(0,0,0,0.09)",
            transition: "all 0.25s ease",
            "&:hover": {
                boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
                transform: "translateY(-2px)",
            },
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            width: "100%",
        }}>

            {/* ══════════════════════════════════════════
                IMAGE ZONE — portada with overlay
            ══════════════════════════════════════════ */}
            <div style={{ position: "relative", overflow: "hidden", minHeight: isXs ? 210 : 240 }}>

                {/* Portada background */}
                {portadaPath ? (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                        <StorageImage
                            alt={item.Nombre || item.Colegio || "portada"}
                            path={portadaPath}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                ) : (
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 0,
                        background: `linear-gradient(160deg, rgba(15,10,30,0.92) 0%, rgba(${hexToRgb(RED)},0.55) 50%, rgba(10,8,20,0.97) 100%)`,
                    }} />
                )}

                {/* Overlay gradient */}
                <div style={{
                    position: "absolute", inset: 0, zIndex: 1,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.78) 100%)",
                }} />

                {/* ── TOP ROW: Comparar + Micrositio (left) | D1 + AAA+ (right) ── */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    zIndex: 3, padding: "12px 12px 0",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8,
                }}>
                    {/* Left pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Comparar */}
                        <button
                            onClick={() => toggleItem?.(item)}
                            className="flex items-center gap-1 font-semibold no-underline transition-all duration-200 hover:opacity-90 flex-shrink-0"
                            style={{
                                backgroundColor: isSelected ? `${RED}cc` : "rgba(255,255,255,0.18)",
                                color: "#fff",
                                fontSize: isXs ? 9 : 10,
                                padding: "5px 10px",
                                borderRadius: 999,
                                border: "1px solid rgba(255,255,255,0.35)",
                                backdropFilter: "blur(6px)",
                                cursor: "pointer",
                                letterSpacing: "0.01em",
                                lineHeight: 1,
                            }}
                        >
                            <DynamicIcon name="AlignJustify" color="#fff" size={10} />
                            Comparar
                        </button>

                        {/* Micrositio */}
                        {hasLink && (
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center font-semibold no-underline transition-all duration-200 hover:opacity-90 flex-shrink-0"
                                style={{
                                    backgroundColor: RED,
                                    color: "#fff",
                                    fontSize: isXs ? 9 : 10,
                                    padding: "5px 12px",
                                    borderRadius: 999,
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    backdropFilter: "blur(4px)",
                                    letterSpacing: "0.01em",
                                    lineHeight: 1,
                                }}
                            >
                                Micrositio
                            </a>
                        )}
                    </div>

                    {/* Right badges: D1 + AAA+ stacked */}
                    <div className="flex flex-col gap-1 items-end flex-shrink-0">
                        <BadgeCategoria category={category} RED={RED} />
                        {qualification && <BadgeCalificacion qualification={qualification} />}
                    </div>
                </div>

                {/* ── CONTENT BOTTOM (stars, name, location, icons) ── */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    zIndex: 3, padding: "0 12px 12px",
                    display: "flex", flexDirection: "column", gap: 6,
                }}>
                    {/* Stars */}
                    <StartSection
                        excelSource=""
                        stars={Stars}
                        typePage="admin"
                        size={isXs ? 15 : 18}
                        gap={3}
                    />

                    {/* School name */}
                    <span
                        onClick={() => hasLink && window.open(link, "_blank")}
                        style={{
                            fontSize: isXs ? "1.05rem" : "1.2rem",
                            fontWeight: 800,
                            color: "#fff",
                            lineHeight: 1.2,
                            letterSpacing: "-0.01em",
                            cursor: hasLink ? "pointer" : "default",
                            display: "block",
                        }}
                    >
                        {item.Nombre || item.Colegio || "Sin Nombre"}
                        {nuevo && nuevo.length > 0 && (
                            <span style={{
                                marginLeft: 6,
                                backgroundColor: RED,
                                color: "#fff",
                                fontSize: 8,
                                fontWeight: 700,
                                padding: "2px 5px",
                                borderRadius: 6,
                                verticalAlign: "middle",
                            }}>{nuevo}</span>
                        )}
                    </span>

                    {/* Location + flags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                            <DynamicIcon name="MapPin" color="rgba(255,255,255,0.70)" size={12} />
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", lineHeight: 1 }}>
                                {city}{department ? ` , ${department}` : ""}
                            </span>
                        </div>
                        {languages && languages.length > 0 && (
                            <div className="flex items-center gap-1">
                                <DynamicIcon name="Globe" color="rgba(255,255,255,0.55)" size={12} />
                                <ImgFlagsCountry languages={languages} size={14} gap={3} />
                            </div>
                        )}
                    </div>

                    {/* Info icons row */}
                    {infoIcons.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {infoIcons.map((info, i) => (
                                <Tooltip key={i} title={info.label} arrow>
                                    <div style={{
                                        width: 30, height: 30,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(255,255,255,0.15)",
                                        border: "1px solid rgba(255,255,255,0.28)",
                                        backdropFilter: "blur(6px)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.28)"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
                                    >
                                        <DynamicIcon name={info.icon} color="rgba(255,255,255,0.90)" size={14} />
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════
                BOTTOM — white zone: Rector + Respaldos
            ══════════════════════════════════════════ */}
            <div style={{
                backgroundColor: "#fff",
                padding: "14px 14px 14px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
            }}>
                {/* Rector photo + label + name (centered column) */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: isXs ? 64 : 80 }}>
                    <div className="relative" style={{ marginBottom: 6 }}>
                        {directorPhoto ? (
                            <div style={{
                                width: isXs ? 56 : 68,
                                height: isXs ? 56 : 68,
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: `2.5px solid ${RED}44`,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                            }}>
                                <StorageImage
                                    alt={directorName}
                                    path={directorPhoto}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        ) : (
                            <Avatar sx={{
                                width: isXs ? 56 : 68,
                                height: isXs ? 56 : 68,
                                border: `2.5px solid ${RED}44`,
                            }} />
                        )}

                        {/* School logo badge bottom-right of photo */}
                        {logoColegio && (
                            <div style={{
                                position: "absolute",
                                bottom: -4, right: -4,
                                width: 22, height: 22,
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid #fff",
                                backgroundColor: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}>
                                <StorageImage
                                    alt="logo"
                                    path={logoColegio}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                        )}
                    </div>

                    <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1 }}>
                        Rectoría
                    </span>
                    <a
                        href={directorWeb || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: isXs ? 10 : 11,
                            fontWeight: 700,
                            color: "#1f2937",
                            textDecoration: "none",
                            textAlign: "center",
                            lineHeight: 1.25,
                            marginTop: 2,
                        }}
                        className="hover:underline"
                    >
                        {directorName}
                    </a>
                </div>

                {/* Vertical divider */}
                {accreditations.length > 0 && (
                    <div style={{ width: 1, alignSelf: "stretch", background: "#f0f0f0", flexShrink: 0, margin: "2px 0" }} />
                )}

                {/* Respaldos */}
                {accreditations.length > 0 && (
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1 }}>
                            Respaldos
                        </span>
                        {/* 2-column grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4px 6px",
                        }}>
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
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        textAlign: "center",
                                    }}
                                >
                                    {acc}
                                </span>
                            ))}
                        </div>
                    </div>
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

const BadgeCategoria = ({ category, RED }) => (
    <div
        className="flex flex-col items-center justify-center text-center text-white"
        style={{
            backgroundColor: RED,
            borderRadius: 10,
            padding: "5px 10px",
            minWidth: 54,
            lineHeight: 1.15,
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(4px)",
        }}
    >
        <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
            D{category}
        </span>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.85 }}>
            Categoría
        </span>
    </div>
);

const BadgeCalificacion = ({ qualification }) => (
    <div
        className="flex flex-col items-center justify-center text-center"
        style={{
            background: "linear-gradient(135deg, #f5c518 0%, #d4a017 100%)",
            color: "#1a1000",
            borderRadius: 10,
            padding: "5px 10px",
            minWidth: 54,
            lineHeight: 1.15,
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(4px)",
        }}
    >
        <span style={{ fontSize: 14, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.01em" }}>
            {qualification}
        </span>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.75 }}>
            Calificación
        </span>
    </div>
);