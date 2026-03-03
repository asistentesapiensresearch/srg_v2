import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, FormControlLabel, Switch } from '@mui/material';

export const ArticleForm = ({ open, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        author: '',
        category: '',
        isPublished: false
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({ title: '', slug: '', summary: '', author: '', category: '', isPublished: false });
    }, [initialData, open]);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        // Genera slug: minúsculas, sin acentos, espacios por guiones
        const slug = title.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData({ ...formData, title, slug });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initialData ? 'Editar Artículo' : 'Nuevo Artículo'}</DialogTitle>
            <DialogContent>
                <Box className="flex flex-col gap-4 mt-2">
                    <TextField label="Título" fullWidth value={formData.title} onChange={handleTitleChange} />
                    <TextField label="Slug (URL)" fullWidth value={formData.slug} disabled helperText="Se genera automáticamente" />
                    <TextField label="Autor" fullWidth value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />
                    <TextField label="Categoría" fullWidth value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    <TextField label="Resumen" fullWidth multiline rows={3} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />
                    <FormControlLabel
                        control={<Switch checked={formData.isPublished} onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} />}
                        label="Publicar inmediatamente"
                    />
                </Box>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={() => onSave(formData, initialData?.id)}>
                    {initialData ? 'Actualizar' : 'Crear'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};