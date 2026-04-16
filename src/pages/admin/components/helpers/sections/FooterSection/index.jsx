import { Box, Typography } from '@mui/material'
import { useImageUrl } from '@src/hooks/useImageUrl';
import { useSelector } from 'react-redux';
import { fieldsSection } from './fields';
import { useMemo } from 'react';
import PageRenderer from '../../../builder/Renderer';
import DynamicIcon from '../../../builder/helpers/DynamicIcon';

const FooterSection = ({
    children = []
}) => {

    const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);

    const info = useMemo(() => {
        return (data && model) ? {
            title: data[fieldsSection[model]?.colegio] || "",
            logo: data[fieldsSection[model]?.logo] || "",
        } : {};
    }, [data,model]);

    const logoUrl = useImageUrl(info.logo);

    return (
        <Box
            sx={{
                backgroundColor: "#0e0e0e",
                width: "100%",
                marginTop: "50px",
            }}
        >
            <Box
                sx={{
                    width: {
                        xs: "95%",
                        md: "90%"
                    },
                    margin: "0 auto",
                }}
            >
                <Box
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10"
                >
                    <Box
                        className="flex flex-col gap-4"
                    >
                        <Box className="flex justify-center items-center md:justify-start gap-4  border-b-2 border-zinc-700 pb-5">
                            <img src={logoUrl} alt={`Logo ${info.title}`} style={{ maxWidth: "80px" }} />
                            <Box>
                                <h5 style={{color: "white"}}>{info.title}</h5>
                                {/* Aqui toda obtener esos campos mientras son quemados ya que aún no estan */}
                                <span className='text-zinc-400 text-[15px]'>{"Barranquilla, Colombia · Desde 1962"}</span>
                            </Box>
                        </Box>
                        <Box className="border-b-2 border-zinc-700 py-5 flex justify-center items-center md:justify-start">
                            {children && children.length > 0 && children?.some((child) => child.type === "InfoItem") ?  (
                                children.filter((child) => child.type === "InfoItem")
                                    .map((child) => (
                                        <Box 
                                            sx={{ position: "relative", zIndex: 1 }}
                                            key={child.id} 
                                            className="flex flex-col"
                                        >
                                            <PageRenderer sections={[child]} />
                                        </Box>
                                    ))
                                ) : (
                                <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                                    <Typography className="text-gray-400 font-medium">
                                        Marcas vacias: Aquí debe ir el componente de InfoItem (InfoItem) (+)
                                    </Typography>
                                </Box>
                                )
                            }
                        </Box>
                        <Box className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-4">
                            <span className='text-zinc-400 text-[12px]'>SÍGUENOS</span>
                            {children && children.length > 0 && children?.some((child) => child.type === "DynamicSocialMedia") ?  (
                                children.filter((child) => child.type === "DynamicSocialMedia")
                                    .map((child) => (
                                        <Box 
                                            sx={{ position: "relative", zIndex: 1 }}
                                            key={child.id} 
                                            className="flex flex-col"
                                        >
                                            <PageRenderer sections={[child]} />
                                        </Box>
                                    ))
                                ) : (
                                <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                                    <Typography className="text-gray-400 font-medium">
                                        Marcas vacias: Aquí debe ir el componente de DynamicSocialMedia (DynamicSocialMedia) (+)
                                    </Typography>
                                </Box>
                                )
                            }
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            className="flex flex-col gap-2 items-center md:items-start"
                        >
                            <Box className="flex gap-4 ">
                                <DynamicIcon name={"MapPin"} color={"#c00002"} size={24} />
                                <h6 className='text-zinc-400'>COMO LLEGAR</h6>
                            </Box>
                            {children && children.length > 0 && children?.some((child) => child.type === "EmbedContent") ?  (
                                children.filter((child) => child.type === "EmbedContent")
                                    .map((child) => (
                                        <Box 
                                            sx={{ position: "relative", zIndex: 1 }}
                                            key={child.id} 
                                            className="w-full flex flex-col"
                                        >
                                            <PageRenderer sections={[child]} />
                                        </Box>
                                    ))
                                ) : (
                                <Box className="w-full p-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                                    <Typography className="text-gray-400 font-medium">
                                        Marcas vacias: Aquí debe ir el componente de EmbedContent (EmbedContent) (+)
                                    </Typography>
                                </Box>
                                )
                            }
                        </Box>

                    </Box>
                </Box>
                <Box className="border-t-2 border-zinc-700">
                    <p className="pt-5 pb-5 m-0 text-zinc-400 text-center">
                        &copy; {new Date().getFullYear()} Sapiens Research · Todos los derechos reservados
                    </p>
                </Box>
            </Box>
        </Box>
    )
}

export default FooterSection
