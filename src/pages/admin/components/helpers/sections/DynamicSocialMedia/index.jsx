import { useState, useEffect, useMemo } from 'react';
import { Box, Stack, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, Link as LinkIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function DynamicSocialMedia({
    // Contexto inyectado
    institution,
    research,
    targetField = "socialMedia",
    // Props visuales
    alignment = "center",
    icon_size = 24,
    gap = 2,
    icon_color = "#4b5563",
    hover_color = "#c10008",
    isBackground = false,
    bg_icon_color = "none",
    show_website = true,
    marginTop = 10
}) {

    const [loading, setLoading] = useState(true);

    const { data } = useSelector((state) => state.sections.fetchData.databaseDownload);

    useEffect(() => {
        if(data) setLoading(false);
    }, [data])

    // 2. Determinar la fuente de datos final y procesar las redes
    const activeLinks = useMemo(() => {
        // ¿De dónde sacamos la data?
        const entityData = data ? data : (institution || research);

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
        if (show_website && entityData.website && targetField != "rectorSocial") {
            links.push({ network: 'website', url: entityData.website });
        }

        return links;
    }, [data, institution, research, targetField, show_website]);



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
        <Box sx={{ width: '100%', display: 'flex', justifyContent: alignment, marginTop: `${marginTop}px` }}>
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
                                    backgroundColor: (isBackground) ? bg_icon_color : "none",
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
                    { data
                        ? "No se encontraron redes para esta búsqueda."
                        : "No hay redes configuradas para esta entidad."}
                </Box>
            )}
        </Box>
    );
}