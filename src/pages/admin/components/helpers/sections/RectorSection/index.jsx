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

    const colegio = data[fieldsSection[model]?.colegio] || "Nombre colegio"
    const rectorName = data[fieldsSection[model]?.rectorName] || "Sin Nombre de rector"
    const rectorDescription = data[fieldsSection[model]?.rectorDescription] || "Sin descripcion"


    return (
        <Box
            sx={{
                backgroundColor: "#EEEEEE",
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "0.3fr 1fr",
                },
                gap: "30px",
                padding: "50px",
            }}
        >
            <Box 
                className="flex flex-col justify-center items-center gap-4"
            >
                <Box
                    sx={{
                        border: "4px solid #fff",
                        width: "250px",
                        height: "250px",
                        backgroundImage: imageRector ? `url(${imageRector})` : "none",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        borderRadius: "20px",
                        boxShadow: '0 6px 20px #000'
                    }}
                ></Box>
                {/* <p>{imageRector}</p> */}
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
                <Box>
                    <h2 className="font-bold">{rectorName}</h2>
                    <h4 className="font-bold" style={{
                        color: "#c10008"
                    }}>
                        RECTOR { colegio.toUpperCase() }
                    </h4>
                    <div style={{
                        borderTop: "4px solid #c10008",
                        width: "40px",
                    }}></div>
                    {/* description */}
                    <p className="mt-4" style={{color: "#232221"}}>{rectorDescription}</p>
                </Box>
            </Box>
        </Box>
    )
}

export default RectorSection
