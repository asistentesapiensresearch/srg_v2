import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Container, Stack } from '@mui/material';
import { Plus, Newspaper, LayoutGrid } from 'lucide-react';
import { useArticle } from './hooks/useArticle';
import { ArticleCard } from './components/ArticleCard';
import { ArticleForm } from './components/ArticleForm';
import { Preloader } from '@src/components/preloader';

export default function Articles() {
    const { articles, loading, handleSave, handleDelete } = useArticle();

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    // Abrir modal para crear
    const handleOpenCreate = () => {
        setSelectedArticle(null);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleOpenEdit = (article) => {
        setSelectedArticle(article);
        setIsModalOpen(true);
    };

    const onSave = async (data, id) => {
        await handleSave(data, id);
        setIsModalOpen(false);
    };

    if (loading && articles.length === 0) return <Preloader />;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* ENCABEZADO MODULAR */}
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                gap={2}
                mb={6}
            >
                <Box>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, color: 'white', display: 'flex' }}>
                            <Newspaper size={24} />
                        </Box>
                        <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
                            Artículos y Blog
                        </Typography>
                    </Box>
                    <Typography color="text.secondary" variant="body1">
                        Gestiona el contenido editorial, noticias y el diseño de los micrositios.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={handleOpenCreate}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
                    }}
                >
                    Crear Artículo
                </Button>
            </Box>

            {/* GRILLA DE ARTÍCULOS (V2) */}
            {articles.length > 0 ? (
                <Grid container spacing={3}>
                    {articles.map(article => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={article.id}>
                            <ArticleCard
                                article={article}
                                onEdit={() => handleOpenEdit(article)}
                                onDelete={() => handleDelete(article.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                /* ESTADO VACÍO */
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ py: 12, bgcolor: 'grey.50', borderRadius: 8, border: '2px dashed', borderColor: 'grey.200' }}
                >
                    <LayoutGrid size={64} className="text-gray-200 mb-4" />
                    <Typography variant="h6" color="text.secondary" fontWeight="bold">
                        No hay artículos publicados
                    </Typography>
                    <Typography color="text.disabled" mb={4}>
                        Comienza creando tu primera noticia o entrada de blog.
                    </Typography>
                    <Button variant="outlined" startIcon={<Plus />} onClick={handleOpenCreate}>
                        Crear mi primer artículo
                    </Button>
                </Box>
            )}

            {/* FORMULARIO DINÁMICO (CREAR/EDITAR) */}
            {isModalOpen && (
                <ArticleForm
                    open={isModalOpen}
                    article={selectedArticle} // Esta es la prop que recibe el formulario
                    onClose={() => setIsModalOpen(false)}
                    onSave={onSave}
                />
            )}
        </Container>
    );
}