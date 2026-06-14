import { Card, CardContent, Typography, Box, IconButton, Chip, CardActions } from '@mui/material';
import { Edit, Trash2, LayoutTemplate, User, Tag } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const PageCard = ({ page, onEdit, handleDelete }) => {
    const navigate = useNavigate();

    const handleClickDelete = useCallback(async (page) => {
        if (!confirm(`¿Eliminar la página "${page.title}"?`)) return;
        try {
            await handleDelete(page.id);
        } catch (e) {
            console.error(e);
            alert("Error al eliminar");
        }
    });

    return (
        <Card className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow rounded-xl">
            <CardContent className="grow">
                <Box className="flex justify-between items-start mb-2">
                    <Typography variant="h6" className="font-bold line-clamp-2">{page.title}</Typography>
                    <Chip
                        label={page.isPublished ? "Publicado" : "Borrador"}
                        size="small"
                        color={page.isPublished ? "success" : "default"}
                    />
                </Box>
                <Typography variant="body2" color="textSecondary" className="mb-4 line-clamp-3">
                    {page.summary}
                </Typography>
                <Box className="flex flex-col gap-1">
                    <Box className="flex items-center gap-1 text-xs text-gray-500">
                        <User size={14} /> {page.author || 'Sin autor'}
                    </Box>
                    <Box className="flex items-center gap-1 text-xs text-gray-500">
                        <Tag size={14} /> {page.category || 'General'}
                    </Box>
                </Box>
            </CardContent>
            <CardActions className="bg-gray-50 justify-between px-4 py-2">
                <IconButton size="small" color="primary" onClick={() => navigate(`/admin/page/${page.id}`)} title="Editar Diseño">
                    <LayoutTemplate size={20} />
                </IconButton>
                <Box>
                    <IconButton size="small" onClick={() => onEdit(page)}><Edit size={18} /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleClickDelete(page)}><Trash2 size={18} /></IconButton>
                </Box>
            </CardActions>
        </Card>
    );
};