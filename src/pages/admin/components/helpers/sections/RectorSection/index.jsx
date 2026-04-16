import { Box, Typography } from "@mui/material"
import { useSelector } from "react-redux";
import PageRenderer from "../../../builder/Renderer";
import { useImageUrl } from "@src/hooks/useImageUrl";
import { fieldsSection } from "./fields";
import { useMemo } from "react";

const RectorSection = ({
    children = []
}) => {
    
    const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);
    const fieldsDB = fieldsSection.db?.[model];

    const rectorData = useMemo(() => {
        if (!data || !model || !fieldsDB) return { isLoading: true };

        return {
            imageRector: data?.[fieldsDB?.rectorPhoto] || "",
            colegio: data?.[fieldsDB?.colegio] || "Nombre colegio",
            rectorName: data?.[fieldsDB?.rectorName] || "Sin Nombre de rector",
            rectorDescription: data?.[fieldsDB?.rectorDescription] || "Sin descripcion",
            isLoading: false
        };
    }, [data, model, fieldsDB]);

    const imageRector =  useImageUrl(rectorData?.imageRector) || "";

    if (rectorData.isLoading) {
        return <p>Cargando información del rector...</p>;
    }

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
                        width: {
                            xs: "200px",
                            md: "250px"
                        },
                        height: {
                            xs: "200px",
                            md: "250px"
                        },
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
            <Box className="flex justify-center items-center w-full">
                <Box sx={{ width: "100%" }}>
                    <h2 className="font-bold">{rectorData.rectorName}</h2>

                    <h4
                        className="font-bold"
                        style={{ color: "#c10008" }}
                    >
                        RECTOR {rectorData.colegio.toUpperCase()}
                    </h4>

                    <div
                        style={{
                            borderTop: "4px solid #c10008",
                            width: "40px",
                        }}
                    />
                    <p
                        className="mt-4 text-justify"
                        style={{
                            color: "#232221",
                            maxWidth: "1000px"
                        }}
                    >
                        {rectorData.rectorDescription}
                    </p>
                </Box>
            </Box>
        </Box>
    )
}

export default RectorSection
