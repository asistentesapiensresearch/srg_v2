import { Box, Typography } from "@mui/material"
import { useSelector } from "react-redux";
import PageRenderer from "../../../builder/Renderer";
import { useImageUrl } from "@src/hooks/useImageUrl";
import { fieldsSection } from "./fields";

const RectorSection = ({
    children = []
}) => {
    
    const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);
    
    const imageRector =  useImageUrl(data?.rectorPhoto) || "";

    // 🔐 Guard clause (clave)
    if (!data || !model || !fieldsSection[model]) {
        return <p>Cargando información del rector...</p>;
    }

    const rectorName = data[fieldsSection[model]?.rectorName] || "Sin Nombre de rector"
    const rectorDescription = data[fieldsSection[model]?.rectorDescription] || "Sin descripcion"


    return (
        <Box
            sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "0.3fr 1fr",
                gap: "10px",
                padding: "40px",
            }}
        >
            <Box 
                sx={{

                }}
                className="flex flex-col justify-center items-center "
            >
                <Box
                    sx={{
                        border: "2px solid #C10007",
                        width: "120px",
                        height: "120px",
                        backgroundImage: imageRector ? `url(${imageRector})` : "none",
                        backgroundPosition: "center",
                        borderRadius: "50%",
                    }}
                >

                </Box>
                {/* <p>{imageRector}</p> */}
                <p className="font-bold">{rectorName}</p>
                {/* redes sociales */}
                {children && children.length > 0 && children?.some((child) => child.type === "DynamicSocialMedia") ?  (
                        children.filter((child) => child.type === "DynamicSocialMedia")
                        .map((child) => (
                            <Box key={child.id} className="w-full flex flex-col">
                                <PageRenderer sections={[child]} />
                            </Box>
                        ))
                    ) : (
                        <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                            <Typography className="text-gray-400 font-medium">
                                Redes vacias: Aquí debe ir el componente de DynamicSocialMedia (+)
                            </Typography>
                        </Box>
                    )
                }
            </Box>
            <Box 
                className="flex justify-center items-center"
            >
                {/* description */}
                <p>{rectorDescription}</p>
            </Box>
        </Box>
    )
}

export default RectorSection
