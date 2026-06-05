import { Box, Tooltip } from "@mui/material";
import esFlag from "../../../../../../../assets/images/es.webp";
import enFlag from "../../../../../../../assets/images/us.webp";
import frFlag from "../../../../../../../assets/images/fr.webp";
import deFlag from "../../../../../../../assets/images/de.webp";
import ptFlag from "../../../../../../../assets/images/pt.webp";

const flagsIdioms = {
    "Español": {
        url: esFlag,
        alt: "Bandera de idioma Español"
    },
    "Inglés-B": {
        url: enFlag,
        alt: "Bandera de idioma Inglés Británico"
    },
    "Inglés-A": {
        url: enFlag,
        alt: "Bandera de idioma Inglés Americano"
    },
    "Francés": {
        url: frFlag,
        alt: "Bandera de idioma Francés"
    },
    "Alemán": {
        url: deFlag,
        alt: "Bandera de idioma Alemán"
    },
    "Portugués": {
        url: ptFlag,
        alt: "Bandera de idioma Portugués"
    },
    "Italiano": {
        url: enFlag,
        alt: "Bandera de idioma Italiano"
    },
    "Mandarín": {
        url: enFlag,
        alt: "Bandera de idioma Mandarín"
    },
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
            {languages && languages.length > 0 ? (
                languages.map((language) => {
                    const flag = flagsIdioms[language];

                    if (!flag) return null;

                    return (
                        <Tooltip title={language} arrow key={language}>
                            <Box
                                component="img"
                                src={flag.url}
                                alt={flag.alt}
                                sx={{
                                    width: size,
                                    height: "auto",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    display: "block",
                                }}
                            />
                        </Tooltip>
                    );
                })
            ) : null}
        </Box>
    );
};

export default ImgFlagsCountry;