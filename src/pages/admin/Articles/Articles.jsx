import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { Plus, FileText } from 'lucide-react';
import { useArticle } from './hooks/useArticle';
import { ArticleCard } from './components/ArticleCard';
import { ArticleForm } from './components/ArticleForm';

export default function Articles() {
    const { articles, loading, refresh, handleSave, handleDelete } = useArticle();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreate = async (data) => {
        await handleSave(data);
        setIsModalOpen(false);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Artículos y Blog</Typography>
                    <Typography color="text.secondary">Gestiona el contenido editorial y sus diseños</Typography>
                </Box>
                <Button variant="contained" startIcon={<Plus />} onClick={() => setIsModalOpen(true)}>
                    Crear Artículo
                </Button>
            </Box>

            <Grid container spacing={3}>
                {articles.map(article => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={article.id}>
                        <ArticleCard article={article} handleDelete={handleDelete} />
                    </Grid>
                ))}
            </Grid>

            <ArticleForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreate}
            />
        </Container>
    );
}