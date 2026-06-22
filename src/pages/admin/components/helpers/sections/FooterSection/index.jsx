import { Box, Typography } from '@mui/material'
import { useImageUrl } from '@src/hooks/useImageUrl';
import { useSelector } from 'react-redux';
import { fieldsSection } from './fields';
import { useMemo } from 'react';
import PageRenderer from '../../../builder/Renderer';
import DynamicIcon from '../../../builder/helpers/DynamicIcon';
import logo from "../../../../../../assets/images/logo.png";
import { Link } from 'react-router-dom';

const toTitleCase = (value = "") => value
    .toLocaleLowerCase('es-CO')
    .replace(/(^|[\s-])\p{L}/gu, (letter) => letter.toLocaleUpperCase('es-CO'));

const FooterSection = ({
    typePage,
    navRankings,
    navGroups,
    navArticles,
    children = []
}) => {

    const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);
    const fieldsDB = fieldsSection.db?.[model];

    const info = useMemo(() => {

        if(typePage === "micro-col" ||  typePage === "micro-uni") {
            return {
                title: data?.[fieldsDB?.colegio] || "",
                logo: data?.[fieldsDB?.logo] || "",
            };
        }

        return {
        }    
    }, [data, fieldsDB, typePage]);

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
                {
                    (typePage === "micro-col" || typePage === "micro-uni") &&
                    <Box
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 py-10"
                        sx={{
                            width: "100%",
                            maxWidth: "1300px",
                            margin: "0 auto",
                        }}
                    >
                        <Box
                            className="flex flex-col gap-4"
                        >
                            <Box className="flex justify-center items-center md:justify-start gap-4  border-b-2 border-zinc-700 pb-5">
                                <img src={logoUrl} alt={`Logo ${info.title}`} style={{ maxWidth: "80px" }} />
                                <Box>
                                    <h5 style={{ color: "white" }}>{toTitleCase(info.title)}</h5>
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
                                <span className='text-zinc-400 text-[18px]'>Síguenos</span>
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
                                    <DynamicIcon name={"MapPin"} color={"var(--color-primary)"} size={24} />
                                    <h6 className='text-zinc-400'>Cómo llegar</h6>
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
                }
                {
                    typePage === "investigation" &&
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "0.2fr 1fr"
                        },
                        py: 2,
                    }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: {
                                xs: "center",
                                md: "flex-start"
                            },
                            alignItems: {
                                xs: "center",
                                md: "flex-start"
                            },
                            mb: 2,
                        }}>
                            <div className="shrink-0 cursor-pointer mt-4">
                                <Link to="/" aria-label="Ir al inicio">
                                    <img
                                        src={logo}
                                        alt="Logo Corporativo"
                                        className="h-10 w-auto md:h-12 transition-transform hover:scale-105"
                                    />
                                </Link>
                            </div>
                        </Box>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(4,1fr)"
                                },
                            }}
                        >
                            {
                                navRankings && navRankings.length > 0 && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            borderRadius: 3,
                                            background: "rgba(255,255,255,0.05)",
                                            backdropFilter: "blur(8px)",
                                        }}
                                        >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            mb: 1.5,
                                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                                            pb: 1,
                                            }}
                                        >
                                            Rankings
                                        </Typography>

                                        <Box
                                            component="ul"
                                            sx={{
                                                listStyle: "none",
                                                p: 0,
                                                m: 0,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 1,
                                            }}
                                        >
                                            {navRankings.map((item, index) => (
                                            <Box
                                                component="li"
                                                key={index}
                                            >
                                                <Link
                                                    href={item.link}
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                <Typography
                                                    sx={{
                                                    color: "rgba(255,255,255,0.85)",
                                                    fontSize: "0.95rem",
                                                    transition: "all .2s ease",
                                                    "&:hover": {
                                                        color: "#fff",
                                                        transform: "translateX(4px)",
                                                    },
                                                    }}
                                                >
                                                    • {item.label}
                                                </Typography>
                                                </Link>
                                            </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )
                            }

                            {
                                navGroups && navGroups.length > 0 && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            borderRadius: 3,
                                            background: "rgba(255,255,255,0.05)",
                                            backdropFilter: "blur(8px)",
                                        }}
                                        >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            mb: 1.5,
                                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                                            pb: 1,
                                            }}
                                        >
                                            Grupos
                                        </Typography>

                                        <Box
                                            component="ul"
                                            sx={{
                                            listStyle: "none",
                                            p: 0,
                                            m: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            }}
                                        >
                                            {navGroups.map((item, index) => (
                                            <Box
                                                component="li"
                                                key={index}
                                            >
                                                <Link
                                                href={item.link}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                >
                                                <Typography
                                                    sx={{
                                                    color: "rgba(255,255,255,0.85)",
                                                    fontSize: "0.95rem",
                                                    transition: "all .2s ease",
                                                    "&:hover": {
                                                        color: "#fff",
                                                        transform: "translateX(4px)",
                                                    },
                                                    }}
                                                >
                                                    • {item.label}
                                                </Typography>
                                                </Link>
                                            </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )
                            }

                            {
                                navArticles && navArticles.length > 0 && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            borderRadius: 3,
                                            background: "rgba(255,255,255,0.05)",
                                            backdropFilter: "blur(8px)",
                                        }}
                                        >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            mb: 1.5,
                                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                                            pb: 1,
                                            }}
                                        >
                                            Revistas
                                        </Typography>

                                        <Box
                                            component="ul"
                                            sx={{
                                            listStyle: "none",
                                            p: 0,
                                            m: 0,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            }}
                                        >
                                            {navArticles.map((item, index) => (
                                            <Box
                                                component="li"
                                                key={index}
                                            >
                                                <Link
                                                href={item.link}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                                >
                                                <Typography
                                                    sx={{
                                                    color: "rgba(255,255,255,0.85)",
                                                    fontSize: "0.95rem",
                                                    transition: "all .2s ease",
                                                    "&:hover": {
                                                        color: "#fff",
                                                        transform: "translateX(4px)",
                                                    },
                                                    }}
                                                >
                                                    • {item.label}
                                                </Typography>
                                                </Link>
                                            </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )
                            }

                        </Box>
                    </Box>
                }
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
