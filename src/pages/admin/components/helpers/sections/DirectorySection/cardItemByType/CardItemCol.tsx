import { Avatar, Box, Button, Card, IconButton, Rating, Stack, Tooltip, Typography } from "@mui/material";
import { useComparison } from "../comparison/ComparisonContext";
import { getValue } from "../results/utils";
import { ArrowLeftRight, CalendarDays, Check, Flag, GraduationCap, MapPin, Plane, Facebook, Instagram, Linkedin, Twitter, Youtube, FileSpreadsheet } from "lucide-react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";
import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";


const iconInfoStyle = {
  width: 25,
  height: 25,
  borderRadius: "50%",
  backgroundColor: "#c00007",
  border: "1px solid #f1d0d2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Componente interno para renderizar la tarjeta individual
export const CardItemCol = ({ item, primaryColor }) => {

    const { toggleItem, selectedItems } = useComparison();

    const itemId = item.id || item._id || JSON.stringify(item);
    const isSelected = selectedItems.some(i => (i.id || i._id || JSON.stringify(i)) === itemId);

    const getAlias = (column) => {
        // Validación segura: si existe y no es null/undefined
        if (item[column] !== undefined && item[column] !== null) {
            return item[column];
        }
        // Retornamos un fallback visual o 0 si prefieres
        return "";
    };

    // Lógica de variables
    const Vinculada = getValue(item, ['isLinked']);
    const portada = useImageUrl(getAlias('portadaPhoto') || "");
    const Stars = getAlias('Stars');
    const city = getAlias('Ciudad');
    const department = getAlias('Departamento');
    const years = getAlias('Antiguedad');
    const dateRange = getAlias('Año');
    const category = getAlias('Categoría'); // D1
    const qualification = getAlias('Calificación'); // AAA+
    const accreditationMain = getAlias('Siglas acreditación');
    const accreditationSec = getAlias('Siglas certificación');
    const link = getValue(item, ['path']);
    const hasLink = Boolean(link) && Vinculada;
    const logoColegio = getValue(item, ['logo', 'imagen_institucion']);
    
    const gender = getAlias('Género');
    const sector = getAlias('Sec');
    const calendar = getAlias('Jornada');
    const orientacion = getAlias('Orientación religiosa');
    const zona = getAlias('Zon');
    const dtitulacion = getAlias('Doble titulación');
    const intercambioSalidas = getAlias('Intercambios o salidas internacionales');

    // Director
    const directorName = getValue(item, ['rectorName']);
    const directorPhoto = getValue(item, ['director_foto', 'foto_rector', 'rectorPhoto']);
    const socialRector = getValue(item, ['rectorSocial']);
    let socialR;
    if (socialRector) {
        if (typeof socialRector == 'string') {
            socialR = JSON.parse(socialRector);
        }
    }
    const directorWeb = socialR?.linkedin ?? getAlias('DirectorWeb');

    console.log({socialR});


    // 🔥 IMPORTANTE: El return que faltaba
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            border: isSelected ? `2px solid ${primaryColor}` : '1px solid #e0e0e0',
            position: 'relative',
            transition: 'all 0.2s',
            '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }
        }}>

            {/* COLUMNA 1: CATEGORÍA Y ESTRELLAS */}
            <Box sx={{
                minWidth: 120,
                width: { md: "auto" },
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fcfcfc',
                borderRight: '1px solid #eee',
                ...(
                    Vinculada ? {
                        backgroundColor: "#c00007",
                        
                    } : {
                        backgroundColor: "#fff",
                    }
                )
            }}>
                {
                    Vinculada ? 
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
                            width: 90,
                            borderRadius: "18px",
                            py: 1,
                            px: 1,
                            textAlign: "center",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                        >
                        <Typography
                            sx={{
                            fontSize: "1.8rem",
                            fontWeight: 900,
                            color: "#c00007",
                            lineHeight: 1,
                            letterSpacing: "0.5px",
                            }}
                        >
                            D{category}
                        </Typography>

                        <Typography
                            sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#c00007",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            }}
                        >
                            {qualification}
                        </Typography>
                    </Box>
                    :
                    <Box>
                        <Typography
                            sx={{
                            fontSize: "1.4rem",
                            fontWeight: 900,
                            color: "#a09a9a",
                            lineHeight: 1,
                            letterSpacing: "0.5px",
                            }}
                        >
                            D{category}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.2rem",
                                fontWeight: 600,
                                color: "#a09a9a",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            {qualification}
                        </Typography>

                    </Box>

                }

                {Vinculada && (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        mt: 1,
                        px: 1, borderRadius: 1
                    }}>
                        <StartSection
                            excelSource=""
                            stars={Stars}
                            typePage="admin"
                            size={18}
                            gap={2}
                        />
                    </Box>
                )}
            </Box>

            {/* COLUMNA 2: INFO, REDES Y COMPARAR */}
            <Box sx={{
                flex: 1,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: {
                    xs: "center",
                    lg: "flex-start"
                },
                position: "relative",
                width: "100%",
                minHeight: 220,
                overflow: "hidden",
                ...(Vinculada
                ? {
                    backgroundImage: `url(${portada})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }
                : {
                    backgroundColor: "#fff",
                }),
            }}>
                {/* Overlay */}
                {
                    Vinculada &&
                    <Box
                        sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.78))",
                        zIndex: 1,
                        pointerEvents: "none",
                        }}
                    />
                }
                <Box sx={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: "flex-start", gap: 1 }}>
                    <Box>
                        <Box className='flex gap-3'>
                            <Typography
                                variant="subtitle1"
                                fontWeight="800"
                                // 2. Si hay link es 'a', si no, es un 'div' (o 'span')
                                component={hasLink ? "a" : "div"}
                                // 3. Propiedades condicionales: si no hay link, se pasan como undefined
                                href={hasLink ? link : undefined}
                                target={hasLink ? "_blank" : undefined}
                                rel={hasLink ? "noopener noreferrer" : undefined} // Buena práctica de seguridad
                                sx={{
                                    color: hasLink ? (Vinculada) ? "#fff" : '#a09a9a' : "#a09a9a",
                                    fontWeight: "bold",
                                    textDecoration: 'none',
                                    // 4. Estilos visuales condicionales
                                    cursor: hasLink ? 'pointer' : 'default',
                                    '&:hover': {
                                        textDecoration: hasLink ? 'underline' : 'none'
                                    },
                                    zIndex: 2,
                                }}
                            >
                                {item.Nombre || item.Colegio || 'Sin Nombre'}
                            </Typography>
                        </Box>

                        <Stack position="relative" zIndex={2} direction="row" spacing={0.5} alignItems="center" mb={1}>
                            <MapPin size={14} color={`${Vinculada ? "rgba(255,255,255,0.75)" : "#a09a9a"}`} />
                            <Typography variant="caption" color={`${Vinculada ? "rgba(255,255,255,0.75)" : "#a09a9a"}`}>
                                {city}{department ? `, ${department}` : ''}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
                {Vinculada && (
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1.5,
                        zIndex: 2,
                        mt: 1,
                    }}>
                        {sector?.length > 0 && (
                            <Tooltip title={sector} arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="Building2" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}

                        {calendar?.length > 0 && (
                            <Tooltip title={`Calendario ${calendar}`} arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="CalendarDays" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}

                        {orientacion?.length > 0 && (
                            <Tooltip title={orientacion} arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="Church" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}

                        {gender?.length > 0 && (
                            <Tooltip title={gender} arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="Users" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}

                        {zona?.length > 0 && (
                            <Tooltip title={zona} arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="MapPinned" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}

                        {dtitulacion === "Sí" && (
                            <Tooltip title="Doble Titulación" arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="GraduationCap" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}

                        {intercambioSalidas === "Sí" && (
                            <Tooltip title="Intercambios o salidas internacionales" arrow>
                                <Box sx={iconInfoStyle}>
                                    <DynamicIcon name="Plane" color="#fff" size={15} />
                                </Box>
                            </Tooltip>
                        )}
                    </Box>
                )}

                {Vinculada && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt="10px">
                        <Box sx={{
                            width: { md: 140 },
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            textAlign: { md: 'left' },
                            zIndex: 2,
                            ...(
                                Vinculada ? {
                                    color: "#fff"
                                } : {
                                    color: "#000"
                                }
                            )
                        }}>
                            <Typography variant="caption" sx={{ textDecoration: 'underline', fontWeight: 'bold', display: 'block' }}>
                                {accreditationMain}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.75">
                                / {accreditationSec}
                            </Typography>
                        </Box>
                    </Stack>
                )}
            </Box>

            {/* COLUMNA 3: DIRECTOR - ya quedo */}
            {Vinculada && (
                <Box
                    sx={{
                        minWidth: 120,
                        width: { md: "auto" },
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#fff",
                        borderLeft: "1px solid #eee",
                        borderRight: "1px solid #eee",
                    }}
                >
                    {/* CONTENEDOR RELATIVO */}
                    <Box sx={{ position: "relative", width: "auto", height: "auto", mb: 1, display: "flex", flexDirection: "column", alignItems: "center" }}> 
                        {/* Boton de comparar */}
                    {
                        Vinculada &&
                            <Button
                                size="small"
                                variant={isSelected ? "contained" : "outlined"}
                                onClick={() => toggleItem(item)}
                                startIcon={
                                    isSelected ? <Check size={12} /> : <ArrowLeftRight size={12} />
                                }
                                sx={{
                                    borderRadius: 50,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    px: 1.5,
                                    py: 0.3,
                                    minHeight: "unset",
                                    height: "auto",
                                    fontSize: "0.7rem",
                                    borderColor: isSelected ? primaryColor : "#ccc",
                                    color: isSelected ? "white" : "#000",
                                    bgcolor: isSelected ? primaryColor : "transparent",
                                    transition: "all 0.2s",
                                    "& .MuiButton-startIcon": {
                                        mr: 0.4,
                                        ml: 0,
                                    },
                                    "&:hover": {
                                        bgcolor: isSelected ? primaryColor : "#f5f5f5",
                                        color: "#000",
                                        borderColor: primaryColor,
                                        transform: "scale(1.05)",
                                    },
                                    mb: 2,
                                }}
                            >
                                    {isSelected ? "Añadido" : "Comparar"}
                            </Button>
                        }
                        
                        {/* FOTO DIRECTOR */}
                        {directorPhoto ? (
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                }}
                            >
                                <StorageImage
                                    alt={directorName}
                                    path={directorPhoto}
                                    className="w-full h-full object-cover"
                                />
                            </Box>
                        ) : (
                            <Avatar
                                src={directorPhoto}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: "2px solid white",
                                    boxShadow: 2,
                                }}
                            />
                        )}
                        {/* LOGO OVERLAY */}
                        {logoColegio && (
                            <Box
                            sx={{
                                position: "absolute",
                                bottom: -8,
                                left: -20,
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid white",
                                backgroundColor: "#fff",
                            }}
                            >
                            <StorageImage
                                alt="logo"
                                path={logoColegio}
                                className="w-full h-full object-cover"
                            />
                            </Box>
                        )}
                    </Box>
                    {/* NOMBRE */}
                    <Typography
                        variant="caption"
                        component="a"
                        href={directorWeb || "#"}
                        target="_blank"
                        sx={{
                            fontStyle: "italic",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "text.primary",
                            textDecoration: "none",
                        }}
                    >
                        {directorName}
                    </Typography>
                    {/* redes sociales */}
                    <Stack direction="row" spacing={0}>
                        {
                            socialR?.facebook && 
                            <IconButton size="small"><Facebook size={16} color="#C10007" /></IconButton>
                        }
                        {
                            socialR?.youtube && 
                            <IconButton size="small"><Youtube size={16} color="#C10007" /></IconButton>
                        }
                        {
                            socialR?.instagram && 
                            <IconButton size="small"><Instagram size={16} color="#C10007" /></IconButton>
                        }
                        {
                            socialR?.linkedin && 
                            <IconButton size="small"><Linkedin size={16} color="#C10007" /></IconButton>
                        }
                        {
                            socialR?.cvlac && 
                            <IconButton size="small"><FileSpreadsheet size={16} color="#C10007" /></IconButton>
                        }
                    </Stack>
                </Box>
            )}
        </Card>
    );
};