// src/view/sections/DirectorySection/results/DirectoryCard.tsx
import React from 'react';
import {
    Card, Box, Typography, Button, Tooltip,
    Avatar, IconButton, Stack, Rating,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import {
    MapPin, CalendarDays, GraduationCap, Plane,
    Facebook, Twitter, Youtube, Instagram,
    Flag, ArrowLeftRight,
    ArrowDown as ArrowDownIcon, // Corregido nombre común en lucide
    Check
} from "lucide-react";
import { getValue } from './utils';
import FemaleIcon from "../icons/female";
import MaleIcon from "../icons/male";
import { useComparison } from '../comparison/ComparisonContext';
import { StorageImage } from '@aws-amplify/ui-react-storage';

const pillButtonStyle = {
    borderRadius: 50,
    textTransform: 'none',
    fontWeight: 600,
    px: 2,
    fontSize: '0.75rem'
};

// Componente interno para renderizar la tarjeta individual
const CardItem = ({ item, primaryColor }) => {
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

    const Stars = getAlias('Stars');
    const city = getAlias('Ciudad');
    const department = getAlias('Departamento');
    const calendar = getAlias('Jornada');
    const years = getAlias('Antiguedad');
    const category = getAlias('Categoría'); // D1
    const qualification = getAlias('Calificación'); // AAA+
    const accreditationMain = getAlias('Siglas acreditación');
    const accreditationSec = getAlias('Siglas certificación');
    const gender = getAlias('Género');
    const link = getValue(item, ['path']);
    const logoColegio = getValue(item, ['logo', 'imagen_institucion']);

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

    // 🔥 IMPORTANTE: El return que faltaba
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
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
                width: { md: 120 },
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fcfcfc',
                borderRight: '1px solid #eee'
            }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: primaryColor }}>D{category}</Typography>
                <Typography variant="body2" fontWeight="600" mb={1}>{qualification}</Typography>

                {Vinculada && (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        bgcolor: '#fbbc05', px: 1, borderRadius: 1, border: '1px solid #d4a004'
                    }}>
                        <Rating value={1} max={1} size="small" readOnly sx={{ color: 'black' }} />
                        <Typography variant="caption" fontWeight="bold" color="black">
                            {Stars} Stars
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* COLUMNA 2: INFO, REDES Y COMPARAR */}
            <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight="800"
                            sx={{
                                color: primaryColor,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            component="a"
                            href={link || '#'}
                            target="_blank"
                        >
                            {item.Nombre || item.Colegio || 'Sin Nombre'}
                        </Typography>

                        <Stack direction="row" spacing={0.5} alignItems="center" mb={1}>
                            <MapPin size={14} color="red" />
                            <Typography variant="caption" color="text.secondary">
                                {city}{department ? `, ${department}` : ''}
                            </Typography>
                        </Stack>

                        {Vinculada && (
                            <Stack direction="row" spacing={1} alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                                <Tooltip title="Calendario">
                                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: '#eee', px: 1, borderRadius: 1 }}>
                                        <CalendarDays size={12} />
                                        <Typography variant="caption" fontWeight="bold">{calendar}</Typography>
                                    </Stack>
                                </Tooltip>

                                <Tooltip title={`Género ${gender}`}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {(String(gender).toLowerCase() === 'mixto' || String(gender).toLowerCase() === 'femenino') && <FemaleIcon height="16px" />}
                                        {(String(gender).toLowerCase() === 'mixto' || String(gender).toLowerCase() === 'masculino') && <MaleIcon height="16px" />}
                                    </Box>
                                </Tooltip>

                                <Box sx={{ display: 'flex', gap: 0.5, px: 1, borderLeft: '1px solid #ddd' }}>
                                    <img src="https://flagcdn.com/w20/es.png" width="14" alt="es" />
                                    <img src="https://flagcdn.com/w20/gb.png" width="14" alt="en" />
                                    <img src="https://flagcdn.com/w20/fr.png" width="14" alt="fr" />
                                </Box>

                                <Tooltip title="Doble Titulación"><GraduationCap size={16} color="gray" /></Tooltip>
                                <Tooltip title="Intercambios"><Plane size={16} color="gray" /></Tooltip>
                            </Stack>
                        )}
                    </Box>

                    {/* Logo y Años */}
                    {Vinculada && (
                        <Box textAlign="center" minWidth={60}>
                            {
                                logoColegio &&
                                <StorageImage alt={item.Nombre || item.Colegio || 'Sin Nombre'} path={logoColegio} className="h-[45px!important] rounded-[50%!important] w-[45px!important]" />
                            }
                            {
                                !directorPhoto &&
                                <Avatar src={logoColegio} variant="square" sx={{ width: 45, height: 45, mb: 0.5, objectFit: 'contain', mx: 'auto' }} />
                            }
                            <Stack direction="row" alignItems="center" spacing={0.5} justifyContent="center">
                                <Flag size={12} />
                                <Typography variant="caption" sx={{ fontSize: 10 }}>{years} años</Typography>
                            </Stack>
                        </Box>
                    )}
                </Box>

                {Vinculada && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
                        <Stack direction="row" spacing={0}>
                            <IconButton size="small"><Facebook size={16} color="#1877F2" /></IconButton>
                            <IconButton size="small"><Twitter size={16} color="#1DA1F2" /></IconButton>
                            <IconButton size="small"><Youtube size={16} color="#CD201F" /></IconButton>
                            <IconButton size="small"><Instagram size={16} color="#E4405F" /></IconButton>
                            <Tooltip title="Admisiones" data-id='admisiones'>
                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ bgcolor: '#eee', px: 1, borderRadius: 1 }}
                                    className='cursor-pointer'>
                                    <Typography variant="caption" fontWeight="bold">Admisiones</Typography>
                                </Stack>
                            </Tooltip>
                        </Stack>

                        <Button
                            variant={isSelected ? "contained" : "outlined"}
                            onClick={() => toggleItem(item)}
                            startIcon={isSelected ? <Check size={14} /> : <ArrowLeftRight size={14} />}
                            sx={{
                                ...pillButtonStyle,
                                borderColor: isSelected ? primaryColor : '#ccc',
                                color: isSelected ? 'white' : '#555',
                                bgcolor: isSelected ? primaryColor : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: isSelected ? primaryColor : '#f5f5f5',
                                    borderColor: primaryColor,
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            {isSelected ? 'Añadido' : 'Comparar'}
                        </Button>
                    </Stack>
                )}
            </Box>

            {/* COLUMNA 3: DIRECTOR */}
            {Vinculada && (
                <Box sx={{
                    width: { md: 150 },
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fafafa',
                    borderLeft: '1px solid #eee',
                    borderRight: '1px solid #eee'
                }}>
                    {
                        directorPhoto &&
                        <StorageImage alt="sleepy-cat" path={directorPhoto} className="h-[60px!important] rounded-[50%!important] w-[60px!important]" />
                    }
                    {
                        !directorPhoto &&
                        <Avatar
                            src={directorPhoto}
                            sx={{ width: 60, height: 60, mb: 1, border: '2px solid white', boxShadow: 2 }}
                        />
                    }
                    <Typography
                        variant="caption"
                        component="a"
                        href={directorWeb || '#'}
                        target="_blank"
                        sx={{ fontStyle: 'italic', fontWeight: 'bold', textAlign: 'center', color: 'text.primary', textDecoration: 'none' }}
                    >
                        {directorName}
                    </Typography>
                </Box>
            )}

            {/* COLUMNA 4: ACREDITACIONES */}
            {Vinculada && (
                <Box sx={{
                    width: { md: 140 },
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: { md: 'left' }
                }}>
                    <Typography variant="caption" sx={{ textDecoration: 'underline', fontWeight: 'bold', display: 'block' }}>
                        {accreditationMain}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        / {accreditationSec}
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export const DirectoryCard = ({ item, primaryColor = '#337ab7' }) => {
    const Vinculada = item.Vinculada?.toLowerCase() == 'si' || item.Vinculada?.toLowerCase() == 'sí';
    return (
        <>
            <CardItem item={item} primaryColor={primaryColor} />

            {/* Sección de Historial (Accordion) */}
            {Vinculada && item.history?.length > 0 && (
                <Accordion
                    elevation={0}
                    sx={{
                        mt: -1,
                        mb: 2,
                        border: '1px solid #eee',
                        borderTop: 'none',
                        '&:before': { display: 'none' }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ArrowDownIcon size={16} />}
                        sx={{ minHeight: 40, bgcolor: '#f9f9f9' }}
                    >
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Ver historial de clasificaciones ({item.history.length})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, bgcolor: '#fafafa' }}>
                        {item.history.map((histItem, index) => (
                            // Renderizamos recursivamente, pero quizás quieras un diseño más simple para el historial
                            <CardItem key={index} item={histItem} primaryColor={primaryColor} />
                        ))}
                    </AccordionDetails>
                </Accordion>
            )}
        </>
    );
};