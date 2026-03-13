import React, { useState, useEffect, useMemo } from 'react';
import { Box, Stack, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, Link as LinkIcon } from 'lucide-react';
import DataSourceManager from '@src/core/data/DataSourceManager';

export default function DynamicSocialMedia({
    // Contexto inyectado
    institution,
    research,

    // Props de Origen de Datos
    dataSourceMode = "context",
    modelName = "Institution",
    searchField = "id",
    searchValue = "",
    targetField = "socialMedia",

    // Props visuales
    alignment = "center",
    icon_size = 24,
    gap = 2,
    icon_color = "#4b5563",
    hover_color = "#c10008",
    show_website = true
}) {

    // Estado para almacenar el registro si lo buscamos manualmente
    const [fetchedRecord, setFetchedRecord] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. Efecto para buscar en la BD si el modo es "custom"
    useEffect(() => {
        if (dataSourceMode !== 'custom' || !modelName || !searchField || !searchValue) {
            return;
        }

        const fetchCustomData = async () => {
            setLoading(true);
            try {
                // Hacemos un list con el filtro especificado (ej: filter: { name: { eq: "Colegio Boston..." } })
                const { data }  = await DataSourceManager.findByField(modelName, searchField, searchValue, 1);

                if (data && data.length > 0) {
                    setFetchedRecord(data[0]);
                } else {
                    setFetchedRecord(null);
                }
            } catch (error) {
                console.error("Error buscando redes sociales en BD:", error);
                setFetchedRecord(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomData();
    }, [dataSourceMode, modelName, searchField, searchValue]);


    // 2. Determinar la fuente de datos final y procesar las redes
    const activeLinks = useMemo(() => {
        // ¿De dónde sacamos la data?
        const entityData = dataSourceMode === 'custom' ? fetchedRecord : (institution || research);

        if (!entityData) return [];

        let socialObj = {};
        const links = [];

        // Parsear el string JSON del campo objetivo (ej: socialMedia o rectorSocial)
        try {
            const rawJson = entityData[targetField];
            if (rawJson) {
                socialObj = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
            }
        } catch (error) {
            console.error(`Error parseando ${targetField}:`, error);
        }

        // Mapear las redes sociales válidas (que no estén vacías)
        Object.entries(socialObj).forEach(([network, url]) => {
            if (url && url.trim() !== "") {
                links.push({ network: network.toLowerCase(), url: url.trim() });
            }
        });

        // Añadir el sitio web si está activo y existe en la data
        if (show_website && entityData.website) {
            links.push({ network: 'website', url: entityData.website });
        }

        console.log('links', links)

        return links;
    }, [dataSourceMode, fetchedRecord, institution, research, targetField, show_website]);


    // 3. Helper de Iconos
    const renderIcon = (networkName) => {
        const props = { size: icon_size };
        switch (networkName) {
            case 'facebook': return <Facebook {...props} />;
            case 'instagram': return <Instagram {...props} />;
            case 'linkedin': return <Linkedin {...props} />;
            case 'twitter': case 'x': return <Twitter {...props} />;
            case 'youtube': return <Youtube {...props} />;
            case 'website': return <Globe {...props} />;
            default: return <LinkIcon {...props} />;
        }
    };


    // 4. Renderizado principal
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: alignment }}>
            {loading ? (
                <CircularProgress size={icon_size} sx={{ color: icon_color }} />
            ) : activeLinks.length > 0 ? (
                <Stack direction="row" spacing={gap} alignItems="center">
                    {activeLinks.map((link, index) => (
                        <Tooltip key={index} title={link.network.charAt(0).toUpperCase() + link.network.slice(1)} arrow>
                            <IconButton
                                component="a"
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: icon_color,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: hover_color,
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {renderIcon(link.network)}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Stack>
            ) : (
                /* Estado vacío para el modo edición */
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 2, color: '#999', fontSize: '0.875rem' }}>
                    {dataSourceMode === 'custom'
                        ? "No se encontraron redes para esta búsqueda."
                        : "No hay redes configuradas para esta entidad."}
                </Box>
            )}
        </Box>
    );
}