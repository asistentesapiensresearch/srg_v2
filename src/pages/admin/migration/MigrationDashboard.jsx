import React, { useState } from 'react';
import { 
    Box, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, 
    Button, Chip, Alert, CircularProgress 
} from '@mui/material';
import { CheckCircle2, Circle, Save, RefreshCw, FileCode, AlertCircle } from 'lucide-react';
import { useMigration } from './hooks/useMigration';

export default function MigrationDashboard() {
    const { items, loading, saveArticle, saveTemplate, refreshTemplates } = useMigration();
    const [actionLoading, setActionLoading] = useState(null);

    // FUNCIÓN CORREGIDA: Limpia comentarios WP y quita el primer H1
    const cleanHtml = (html) => {
        if (!html) return "";
        
        // 1. Eliminar comentarios de bloque de WordPress let cleaned = html.replace(//g, "");
        const regex = new RegExp('', 'g');
        let cleaned = html.replace(regex, "").trim();

        // 2. Eliminar SOLO el primer <h1> que encuentre (incluyendo su contenido)
        // Usamos /i para que no importe si es H1 o h1
        // Al no usar /g, solo reemplaza la primera coincidencia
        cleaned = cleaned.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i, "");

        return cleaned.trim();
    };

    // Generador de IDs únicos para las secciones del template
    const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Acción para crear el Artículo en la DB
    const handleCreateArticle = async (wp) => {
        setActionLoading(wp.slug);
        try {
            const articleData = {
                title: wp.title,
                slug: wp.slug,
                summary: wp.summary || wp.title.substring(0, 160),
                author: wp.author || "Sapiens Research",
                category: wp.category?.split(',')[0] || "General",
                isPublished: true,
                publishedAt: new Date(wp.publishedAt).toISOString(),
                coverImage: wp.featured_image_url || ""
            };
            
            await saveArticle(articleData);
        } catch (error) {
            console.error("Error al crear artículo:", error);
        } finally {
            setActionLoading(null);
        }
    };

    // Acción para crear o actualizar el Template
    const handleProcessTemplate = async (wp, isUpdate = false) => {
        const loadingKey = `${wp.slug}-template`;
        setActionLoading(loadingKey);
        
        try {
            const cleanContent = cleanHtml(wp.content);
            
            // Estructura exacta solicitada para themeSettings
            const sections = [
                {
                    children: [],
                    id: generateId(),
                    type: "ImageSection",
                    props: {
                        border: "none",
                        padding_horizontal: 2,
                        src: wp.featured_image_url || "",
                        margin_top: 0,
                        alt: wp.title,
                        padding_top: 2,
                        object_fit: "cover",
                        hover_opacity: 1,
                        hover_scale: false,
                        max_width: "1200px",
                        margin_bottom: 0,
                        background_color: "#ffffff",
                        width: "100%",
                        object_position: "center",
                        link_target: "_self",
                        link_url: "",
                        alignment: "center",
                        padding_bottom: 2,
                        border_radius: "0px",
                        box_shadow: "none",
                        container_width: "lg",
                        height: "auto"
                    }
                },
                {
                    children: [],
                    id: generateId(),
                    type: "WysiwygSection",
                    props: {
                        className: "",
                        content: cleanContent,
                        customCss: "",
                        maxWidth: "lg",
                        paddingY: 4
                    }
                }
            ];

            const templateData = {
                articleId: wp.dbArticle.id,
                themeSettings: JSON.stringify(sections),
                researchId: null,
                institutionId: null
            };

            await saveTemplate(templateData, isUpdate ? wp.dbTemplate.id : undefined);
            
            // Sincronizamos los estados de los hooks
            refreshTemplates();
            
        } catch (error) {
            console.error("Error al procesar template:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && items.length === 0) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress color="error" />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Asistente de Migración WP
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Limpieza automática de metadatos de WP y remoción de etiquetas H1 duplicadas.
                </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 'bold', py: 2 }}>Artículos del JSON</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Artículo</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Template</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((wp) => (
                            <TableRow key={wp.slug} hover>
                                <TableCell sx={{ py: 2 }}>
                                    <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                                        {wp.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        slug: {wp.slug}
                                    </Typography>
                                </TableCell>

                                <TableCell align="center">
                                    {wp.existsInArticles ? (
                                        <Tooltip title="Ya existe en la base de datos">
                                            <CheckCircle2 size={22} color="#2e7d32" />
                                        </Tooltip>
                                    ) : (
                                        <Circle size={22} color="#e0e0e0" />
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    {wp.existsInTemplates ? (
                                        <Tooltip title="Diseño generado">
                                            <CheckCircle2 size={22} color="#1976d2" />
                                        </Tooltip>
                                    ) : (
                                        <Circle size={22} color="#e0e0e0" />
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    <Box display="flex" justifyContent="flex-end" gap={1}>
                                        {!wp.existsInArticles ? (
                                            <Button 
                                                variant="contained" 
                                                size="small"
                                                color="error"
                                                startIcon={actionLoading === wp.slug ? <CircularProgress size={14} color="inherit" /> : <Save size={16} />}
                                                onClick={() => handleCreateArticle(wp)}
                                                disabled={!!actionLoading}
                                            >
                                                Migrar Artículo
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                color={wp.existsInTemplates ? "primary" : "secondary"}
                                                startIcon={actionLoading === `${wp.slug}-template` ? <CircularProgress size={14} color="inherit" /> : <FileCode size={16} />}
                                                onClick={() => handleProcessTemplate(wp, wp.existsInTemplates)}
                                                disabled={!!actionLoading}
                                            >
                                                {wp.existsInTemplates ? "Sincronizar Diseño" : "Crear Diseño"}
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

// Sub-componente para tooltips
const Tooltip = ({ title, children }) => (
    <Box sx={{ cursor: 'help' }} title={title}>
        {children}
    </Box>
);