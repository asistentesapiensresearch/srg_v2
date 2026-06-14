import React, { useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Button, CircularProgress, Tabs, Tab, TablePagination
} from '@mui/material';
import { CheckCircle2, Circle, Save, FileCode } from 'lucide-react';
import { useMigration } from './hooks/useMigration';
import { uploadData } from 'aws-amplify/storage';

export default function MigrationDashboard({ type = 'article' }) {
    // Asumimos que useMigration ahora expone savePage y las banderas de existencia correspondientes
    const { items, loading, saveArticle, savePage, saveTemplate, refreshTemplates } = useMigration();
    const [actionLoading, setActionLoading] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const isPage = type === 'page';
    
    // Helper para determinar si el elemento ya fue migrado según el tipo
    const exists = (item) => isPage ? item.existsInPages : item.existsInArticles;

    const cleanHtml = (html) => {
        if (!html) return "";
        const regex = new RegExp('', 'g');
        let cleaned = html.replace(regex, "").trim();
        cleaned = cleaned.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i, "");
        return cleaned.trim();
    };

    const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const processAndMigrateCoverImage = async (wpItem) => {
        let imageUrl = wpItem.featured_image_url;
        if (!imageUrl) {
            const match = (wpItem.content || "").match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) imageUrl = match[1];
        }

        let s3Key = null;
        if (imageUrl) {
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const ext = imageUrl.split('.').pop().split(/#|\?/)[0] || 'jpg';
                const s3Path = `${type}s/${wpItem.slug}-cover.${ext}`;
                const result = await uploadData({ path: s3Path, data: blob }).result;
                s3Key = result.path; 
            } catch (error) { console.warn(`Error S3 [${wpItem.slug}]:`, error); }
        }
        return { coverKey: s3Key };
    };

    const handleCreateItem = async (wp) => {
        setActionLoading(wp.slug);
        try {
            const { coverKey } = await processAndMigrateCoverImage(wp);
            const data = {
                title: wp.title,
                slug: wp.slug,
                isPublished: true,
                coverImage: coverKey || wp.featured_image_url || "",
                ...(isPage ? {} : { 
                    summary: wp.summary || wp.title.substring(0, 160),
                    author: wp.author || "Sapiens Research",
                    category: wp.category?.split(',')[0] || "General",
                    publishedAt: new Date(wp.publishedAt).toISOString() 
                })
            };

            isPage ? await savePage(data) : await saveArticle(data);
            refreshTemplates();
        } catch (error) { console.error("Error al crear:", error); } 
        finally { setActionLoading(null); }
    };

    const handleProcessTemplate = async (wp, isUpdate = false) => {
        const loadingKey = `${wp.slug}-template`;
        setActionLoading(loadingKey);
        try {
            const content = cleanHtml((wp.content || "").replace(/<img[^>]+>/i, ''));
            const coverImageSrc = (isPage ? wp.dbPage?.coverImage : wp.dbArticle?.coverImage) || wp.featured_image_url || "";

            const sections = [
                { type: "ImageSection", id: generateId(), props: { src: coverImageSrc, alt: wp.title } },
                { type: "WysiwygSection", id: generateId(), props: { content } }
            ];

            const templateData = {
                themeSettings: JSON.stringify(sections),
                articleId: !isPage ? (isUpdate ? wp.dbArticle.id : null) : null,
                pageId: isPage ? (isUpdate ? wp.dbPage.id : null) : null
            };

            await saveTemplate(templateData, isUpdate ? wp.dbTemplate.id : undefined);
            refreshTemplates();
        } catch (error) { console.error("Error template:", error); } 
        finally { setActionLoading(null); }
    };

    // Lógica de Paginación y Filtrado
    const filteredItems = items.filter(wp => currentTab === 0 ? !exists(wp) : exists(wp));
    const paginatedItems = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Migración de {isPage ? 'Páginas' : 'Artículos'}
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={(e, v) => { setCurrentTab(v); setPage(0); }} textColor="error" indicatorColor="error">
                    <Tab label={`Pendientes (${items.filter(i => !exists(i)).length})`} />
                    <Tab label={`Migrados (${items.filter(i => exists(i)).length})`} />
                </Tabs>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedItems.map((wp) => (
                            <TableRow key={wp.slug} hover>
                                <TableCell>{wp.title}</TableCell>
                                <TableCell align="center">
                                    {exists(wp) ? (
                                        <Tooltip title="Ya existe en la base de datos">
                                            <CheckCircle2 size={20} color="#2e7d32" />
                                        </Tooltip>
                                    ) : (
                                        <Circle size={20} color="#e0e0e0" />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {!exists(wp) ? (
                                        <Button size="small" color="error" onClick={() => handleCreateItem(wp)}>Migrar</Button>
                                    ) : (
                                        <Button size="small" onClick={() => handleProcessTemplate(wp, true)}>Sincronizar Diseño</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination 
                    component="div" 
                    count={filteredItems.length} 
                    rowsPerPage={rowsPerPage} 
                    page={page} 
                    onPageChange={(e, p) => setPage(p)} 
                    onRowsPerPageChange={e => setRowsPerPage(+e.target.value)} 
                />
            </TableContainer>
        </Box>
    );
}

const Tooltip = ({ title, children }) => (
    <Box sx={{ cursor: 'help', display: 'inline-flex' }} title={title}>
        {children}
    </Box>
);