import { Box } from "@mui/material";
import { useSelector } from "react-redux";

const HeaderPortada = () => {

    const { data } = useSelector((state) => state.sections.fetchData.databaseDownload);

    // EXTRAER campos clave (título y slogan) del registro obtenido
    const title = data?.name || "Título no disponible";
    const slogan = data?.slogan || "Slogan no disponible";

    // Usamos la imagen del logo o path como fondo de sección (si existe).
    // Se puede ajustar aquí según el campo que uses en tu modelo.
    const backgroundImage =
      data?.coverImage || // campo personalizado posible
      data?.logo ||
      data?.path ||
      "";

    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "360px",
          color: "#fff",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          p: 4,
        }}
      >

        {/* Contenido principal encima del overlay */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "#fff",
          }}
        >
          <h1 className="w-full text-2xl mt-20 font-black font-[Roboto] text-center" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", marginBottom: "0.6rem" }}>
            {title}
          </h1>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2.5vw, 1.8rem)", lineHeight: 1.4 }}>
            {slogan}
          </p>

         
        </Box>

        {/* Estado en caso de no encontrar registros */}
        {!data && (
          <Box sx={{ position: "relative", zIndex: 2, mt: 2 }}>
            <span>No se encontró el registro solicitado.</span>
          </Box>
        )}
      </Box>
    );
}

export default HeaderPortada
