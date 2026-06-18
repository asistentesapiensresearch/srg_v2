import { Box, Tooltip } from "@mui/material";
import ReactCountryFlag from "react-country-flag";

/**
 * Mapa de idioma → código ISO 3166-1 alpha-2
 * Ref: https://flagcdn.com/
 */
const LANGUAGE_TO_COUNTRY = {
    "Español":    { code: "ES", label: "Español" },
    "Inglés-A":   { code: "US", label: "Inglés (Americano)" },
    "Inglés-B":   { code: "GB", label: "Inglés (Británico)" },
    "Inglés":     { code: "US", label: "Inglés" },
    "Francés":    { code: "FR", label: "Francés" },
    "Alemán":     { code: "DE", label: "Alemán" },
    "Portugués":  { code: "PT", label: "Portugués" },
    "Italiano":   { code: "IT", label: "Italiano" },
    "Mandarín":   { code: "CN", label: "Mandarín" },
    "Japonés":    { code: "JP", label: "Japonés" },
    "Árabe":      { code: "SA", label: "Árabe" },
    "Ruso":       { code: "RU", label: "Ruso" },
    "Coreano":    { code: "KR", label: "Coreano" },
};

const ImgFlagsCountry = ({ languages, size = 20, center = false, gap = "4px" }) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap,
                justifyContent: center ? "center" : "flex-start",
                alignItems: "center",
                flexShrink: 0,
            }}
        >
            {languages && languages.length > 0
                ? languages.map((language) => {
                    const entry = LANGUAGE_TO_COUNTRY[language];
                    if (!entry) return null;

                    return (
                        <Tooltip title={entry.label} arrow key={language}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                    lineHeight: 1,
                                    cursor: "default",
                                    transition: "transform 0.2s ease, filter 0.2s ease",
                                    "&:hover": {
                                        transform: "scale(1.25)",
                                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
                                    },
                                }}
                            >
                                <ReactCountryFlag
                                    countryCode={entry.code}
                                    svg
                                    style={{
                                        width: `${size}px`,
                                        height: `${size * 0.7}px`,
                                        borderRadius: "2px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.22)",
                                        objectFit: "cover",
                                    }}
                                    title={entry.label}
                                />
                            </Box>
                        </Tooltip>
                    );
                })
                : null}
        </Box>
    );
};

export default ImgFlagsCountry;