// src/view/sections/DirectorySection/results/DirectoryCard.tsx
import {
    Card, Box, CardMedia, Chip, CardContent, Stack, Typography,
    Rating, Divider, Button,
    Tooltip
} from "@mui/material";
import { MapPin, ExternalLink, Mail, InfoIcon } from "lucide-react";
import { getValue } from './utils';
import FemaleIcon from "../icons/female";
import MaleIcon from "../icons/male";

// Estilos reutilizables
const pillButtonStyle = {
    borderRadius: 50,
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    fontSize: '0.85rem'
};

export const DirectoryCard = ({ item, viewType, primaryColor }) => {
    // Extracción segura de datos usando el helper
    const city = item['ciudad'];
    const department = item['departamento'];
    const rating = item['stars'] || 0;

    const email = getValue(item, ['email', 'correo']);
    const link = getValue(item, ['web', 'url', 'link', 'sitio']);

    const isList = viewType === 'list';

    /* ALIADOS */
    const calification = item['calificacion'];
    const category =item['categoria'];
    const gender = item['género'];
    const footer = undefined;
    
    const title = item['nombre'];
    const image = item['imagen'];

    return (
        <Card sx={{
            flexDirection: isList ? 'row' : 'column',
            height: '100%',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.04)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
            }
        }} className="block md:flex">

            {/* Contenido */}
            <CardContent sx={{
                p: isList ? 2 : 3
            }} className={`pb-[16px!important] block flex-1 gap-3 ${isList ? 'flex-row md:flex' : 'flex-column'}`}>

                {/* Imagen */}
                <Box sx={{
                    position: 'relative',
                    minWidth: 150,
                    minHeight: 150
                }}>
                    {image && <CardMedia
                        component="img"
                        image={image}
                        alt={title}
                        sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />}

                    {(category || calification) && (<Box sx={{
                        position: 'absolute',
                        display: 'flex',
                        gap: '5px',
                        top: 12, left: 12,
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        {category && (
                            <Chip
                                label={
                                    <Tooltip title="Categoría">
                                        <Stack direction="row" alignItems="center" spacing={1} mb={footer ? 2 : 0} color="text.secondary">
                                            <span className="text-white">D{category}</span>
                                            <InfoIcon size={16} color="white" className="ms-[2px!important]" />
                                        </Stack>
                                    </Tooltip>
                                }
                                size="small"
                                sx={{
                                    bgcolor: 'rgb(51, 122, 183)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: 1
                                }}
                            />
                        )}
                        {calification && (
                            <Chip
                                label={
                                    <Tooltip title="Calificación">
                                        <Stack direction="row" alignItems="center" spacing={1} mb={footer ? 2 : 0} color="text.secondary">
                                            <span className="text-white">{calification}</span>
                                            <InfoIcon size={16} color="white" className="ms-[2px!important]" />
                                        </Stack>
                                    </Tooltip>
                                }
                                size="small"
                                sx={{
                                    bgcolor: 'rgb(51, 122, 183)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: 1
                                }}
                            />
                        )}
                    </Box>)}
                </Box>

                <Box>
                    <Typography variant="h6" fontWeight={800} lineHeight={1.2} mb={0.5}>
                        {title}
                    </Typography>
                    {Number(rating) > 0 && (
                        <Stack direction="row" alignItems="start" spacing={0.5} mb={1}>
                            <Rating defaultValue={Number(rating)} readOnly max={5} size="small" />
                            <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                ({rating} Stars)
                            </Typography>
                        </Stack>
                    )}
                </Box>

                <Box>
                    {(city || department) && (
                        <Stack direction="row" alignItems="center" spacing={1} mb={1} color="text.secondary">
                            <MapPin size={16} />
                            <Typography variant="caption">{city}, {department}</Typography>
                        </Stack>
                    )}
                    {gender && (
                        <Chip
                            label={
                                <Tooltip title={`Género ${gender}`}>
                                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                                        {(gender.toLowerCase() == 'female' || gender.toLowerCase() == 'mixto') && <FemaleIcon iconFill='white' height="17px" />}
                                        {(gender.toLowerCase() == 'male' || gender.toLowerCase() == 'mixto') && <MaleIcon iconFill='white' height="15px" />}
                                        <InfoIcon size={16} color="white" className="ms-[2px!important]" />
                                    </Stack>
                                </Tooltip>
                            }
                            size="small"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                backdropFilter: 'blur(4px)',
                                boxShadow: 1
                            }}
                            className="bg-[var(--color-red-700)!important]"
                        />
                    )}
                </Box>

                {/* Footer Actions */}
                <Box>
                    <Stack direction="column" spacing={1} justifyContent="space-between" alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<ExternalLink size={16} />}
                            href={link || "#"}
                            target="_blank"
                            sx={{
                                ...pillButtonStyle,
                                borderColor: '#e0e0e0',
                                color: 'text.primary',
                                flex: 1,
                                '&:hover': { borderColor: primaryColor, bgcolor: 'transparent', color: primaryColor }
                            }}
                        >
                            Micrositio
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Mail size={16} />}
                            href={email ? `mailto:${email}` : "#"}
                            sx={{
                                ...pillButtonStyle,
                                bgcolor: primaryColor,
                                color: 'white',
                                flex: 1,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: primaryColor, boxShadow: 3 }
                            }}
                        >
                            Contactar
                        </Button>
                    </Stack>
                </Box>

                {footer && (
                    <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Divider sx={{ mb: 2, opacity: 0.5 }} />
                        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                            <Button
                                variant="outlined"
                                startIcon={<ExternalLink size={16} />}
                                href={link || "#"}
                                target="_blank"
                                sx={{
                                    ...pillButtonStyle,
                                    borderColor: '#e0e0e0',
                                    color: 'text.primary',
                                    flex: 1,
                                    '&:hover': { borderColor: primaryColor, bgcolor: 'transparent', color: primaryColor }
                                }}
                            >
                                Micrositio
                            </Button>

                            <Button
                                variant="contained"
                                startIcon={<Mail size={16} />}
                                href={email ? `mailto:${email}` : "#"}
                                sx={{
                                    ...pillButtonStyle,
                                    bgcolor: primaryColor,
                                    color: 'white',
                                    flex: 1,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: primaryColor, boxShadow: 3 }
                                }}
                            >
                                Contactar
                            </Button>
                        </Stack>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};