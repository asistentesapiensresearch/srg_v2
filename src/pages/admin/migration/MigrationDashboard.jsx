import React, { useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Button, CircularProgress, Tabs, Tab, TablePagination
} from '@mui/material';
import { CheckCircle2, Circle, Save, FileCode } from 'lucide-react';
import { useMigration } from './hooks/useMigration';
import { uploadData } from 'aws-amplify/storage';

export default function MigrationDashboard() {
    const { items, loading, saveArticle, saveTemplate, refreshTemplates } = useMigration();
    const [actionLoading, setActionLoading] = useState(null);

    // ─── NUEVOS ESTADOS PARA TABS Y PAGINACIÓN ───────────────────────────
    const [currentTab, setCurrentTab] = useState(0); // 0 = Por Migrar, 1 = Ya Migrados
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Limpia comentarios WP y quita el primer H1
    const cleanHtml = (html) => {
        if (!html) return "";
        const regex = new RegExp('', 'g');
        let cleaned = html.replace(regex, "").trim();
        cleaned = cleaned.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i, "");
        return cleaned.trim();
    };

    // Generador de IDs únicos para las secciones del template
    const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Orquestador de la imagen hacia S3
    const processAndMigrateCoverImage = async (wpItem) => {
        let imageUrl = wpItem.featured_image_url;
        let processedContent = wpItem.content || "";

        if (!imageUrl) {
            const match = processedContent.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) {
                imageUrl = match[1];
            }
        }

        let s3Key = null;

        if (imageUrl) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const ext = imageUrl.split('.').pop().split(/#|\?/)[0] || 'jpg';
                const s3Path = `articles/${wpItem.slug}-cover.${ext}`;

                const result = await uploadData({
                    path: s3Path,
                    data: blob
                }).result;

                s3Key = result.path; 
            } catch (error) {
                console.warn(`Error al migrar imagen S3 para [${wpItem.slug}]:`, error);
            }
        }

        return { coverKey: s3Key };
    };

    // Paso 1: Acción para crear el Artículo en la DB
    const handleCreateArticle = async (wp) => {
        setActionLoading(wp.slug);
        try {
            const { coverKey } = await processAndMigrateCoverImage(wp);

            const articleData = {
                title: wp.title,
                slug: wp.slug,
                summary: wp.summary || wp.title.substring(0, 160),
                author: wp.author || "Sapiens Research",
                category: wp.category?.split(',')[0] || "General",
                isPublished: true,
                publishedAt: new Date(wp.publishedAt).toISOString(),
                coverImage: coverKey || wp.featured_image_url || "" 
            };

            await saveArticle(articleData);
            if(refreshTemplates) refreshTemplates();

        } catch (error) {
            console.error("Error al crear artículo:", error);
        } finally {
            setActionLoading(null);
        }
    };

    // Paso 2: Acción para crear o actualizar el Template
    const handleProcessTemplate = async (wp, isUpdate = false) => {
        const loadingKey = `${wp.slug}-template`;
        setActionLoading(loadingKey);

        try {
            let contentSinImagen = (wp.content || "").replace(/<img[^>]+>/i, '');
            const cleanContent = cleanHtml(contentSinImagen);
            const coverImageSrc = wp.dbArticle?.coverImage || wp.featured_image_url || "";

            const sections = [
                {
                    children: [],
                    id: generateId(),
                    type: "ImageSection",
                    props: {
                        border: "none",
                        padding_horizontal: 2,
                        src: coverImageSrc,
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
            refreshTemplates();

        } catch (error) {
            console.error("Error al procesar template:", error);
        } finally {
            setActionLoading(null);
        }
    };

    // ─── LÓGICA DE FILTRADO Y PAGINACIÓN COHESIVA ────────────────────────
    
    // 1. Filtrar primero por el estado de la pestaña actual
    const filteredItems = items.filter((wp) => {
        if (currentTab === 0) {
            return !wp.existsInArticles; // No migrados (Pendientes)
        } else {
            return wp.existsInArticles;  // Ya migrados (Parcial o totalmente)
        }
    });

    // 2. Segmentar el resultado filtrado según la página actual
    const paginatedItems = filteredItems.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Manejadores de eventos de paginación
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reinicia a la primera página si cambia el tamaño
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        setPage(0); // Crucial: Reiniciar página al cambiar de pestaña para evitar desbordamientos
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
                    Filtra, pagina y procesa de forma eficiente los contenidos extraídos de WordPress.
                </Typography>
            </Box>

            {/* ─── CONTROL DE PESTAÑAS (TABS) ──────────────────────────────── */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange} 
                    textColor="error" 
                    indicatorColor="error"
                    aria-label="Filtros de migración"
                >
                    <Tab 
                        label={`Por Migrar (${items.filter(i => !i.existsInArticles).length})`} 
                        id="tab-pending" 
                    />
                    <Tab 
                        label={`Migrados (${items.filter(i => i.existsInArticles).length})`} 
                        id="tab-completed" 
                    />
                </Tabs>
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
                        {paginatedItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    No hay artículos en esta categoría.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedItems.map((wp) => (
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
                            ))
                        )}
                    </TableBody>
                </Table>
                
                {/* ─── COMPONENTE DE PAGINACIÓN ─────────────────────────────── */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredItems.length} // Cuenta los elementos filtrados por la tab activa
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                />
            </TableContainer>
        </Box>
    );
}

const Tooltip = ({ title, children }) => (
    <Box sx={{ cursor: 'help' }} title={title}>
        {children}
    </Box>
);