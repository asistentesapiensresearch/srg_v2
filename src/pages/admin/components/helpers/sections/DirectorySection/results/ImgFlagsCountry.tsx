import { Box, Tooltip } from "@mui/material";

const flagsIdioms = {
    "Español" : {
        url: "https://flagcdn.com/w20/es.png",
        alt: "Bandera de idioma Español"
    },
    "Inglés" : {
        url: "https://flagcdn.com/w20/gb.png",
        alt: "Bandera de idioma Inglés"
    },
    "Francés" : {
        url: "https://flagcdn.com/w20/fr.png",
        alt: "Bandera de idioma Frances"
    },
}

const ImgFlagsCountry = ({ languages, size = 20, center = false, gap = 0.5 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap,
        px: 1,
        justifyContent: center ? "center" : "flex-start",
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
                }}
              />
            </Tooltip>
          );
        })
      ) : (
        <p>Sin idiomas</p>
      )}
    </Box>
  );
};

export default ImgFlagsCountry
