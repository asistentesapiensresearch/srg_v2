import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    Button, Box, FormControlLabel, Switch, FormControl, InputLabel, Typography
} from '@mui/material';
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { remove, getUrl } from "aws-amplify/storage";
import { Preloader } from "@src/components/preloader";
import { moveIconToDefinitiveFolder } from '../../helpers/moveIconToDefinitiveFolder';

export const ArticleForm = ({ open, onClose, onSave, article }) => {
    const TEMP_FOLDER = "articles/temp/";

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        author: '',
        category: '',
        coverImage: '',
        isPublished: false
    });

    // Estados para la imagen
    const [imagePreview, setImagePreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [tempKeys, setTempKeys] = useState([]);

    useEffect(() => {
        if (open) {
            if (article) {
                setFormData({
                    title: article.title || '',
                    slug: article.slug || '',
                    summary: article.summary || '',
                    author: article.author || '',
                    category: article.category || '',
                    coverImage: article.coverImage || '',
                    isPublished: article.isPublished || false
                });

                // Cargar preview si existe imagen
                if (article.coverImage) {
                    getUrl({ path: article.coverImage }).then((res) => {
                        setImagePreview(res.url.toString());
                    });
                }
            } else {
                setFormData({
                    title: '', slug: '', summary: '', author: '', category: '', coverImage: '', isPublished: false
                });
                setImagePreview("");
            }
            setTempKeys([]);
        }
    }, [article, open]);

    // --- Lógica de Upload ---
    const handleUploadStart = () => setUploading(true);

    const handleUploadSuccess = async ({ key }) => {
        setFormData(prev => ({ ...prev, coverImage: key }));
        setTempKeys(prev => [...prev, key]);
        const result = await getUrl({ path: key });
        setImagePreview(result.url.toString());
        setUploading(false);
    };

    const handleUploadError = (err) => {
        console.error("Error uploading:", err);
        setUploading(false);
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData({ ...formData, title, slug });
    };

    const handleInternalSave = async () => {
        setUploading(true);
        try {
            let finalKey = formData.coverImage;

            // Si hay una imagen nueva en temp, moverla a la carpeta definitiva
            if (finalKey.startsWith(TEMP_FOLDER)) {
                finalKey = await moveIconToDefinitiveFolder("articles/", finalKey, formData.slug);
            }

            // Si estamos editando y la imagen cambió, borrar la vieja
            if (article?.id && article.coverImage && article.coverImage !== finalKey) {
                await remove({ path: article.coverImage });
            }

            const finalData = { ...formData, coverImage: finalKey };
            await onSave(finalData, article?.id);
            onClose();
        } catch (error) {
            console.error("Error saving article:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = async () => {
        // Limpiar archivos subidos a temp que no se guardaron
        for (const key of tempKeys) {
            try { await remove({ path: key }); } catch (e) { }
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
            <DialogTitle>{article ? 'Editar Artículo' : 'Nuevo Artículo'}</DialogTitle>
            <DialogContent>
                <Box className="flex flex-col gap-4 mt-2">
                    <TextField label="Título" fullWidth value={formData.title} onChange={handleTitleChange} />

                    <TextField label="Slug (URL)" fullWidth value={formData.slug} disabled helperText="Se genera automáticamente" />

                    {/* Sección de Imagen */}
                    <FormControl fullWidth>
                        <Typography variant="caption" color="textSecondary" gutterBottom>
                            Imagen de portada (Cover)
                        </Typography>

                        {imagePreview && (
                            <Box className="mb-4">
                                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded border" />
                            </Box>
                        )}

                        <FileUploader
                            acceptedFileTypes={["image/*"]}
                            path={TEMP_FOLDER}
                            maxFileCount={1}
                            onUploadStart={handleUploadStart}
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                            showThumbnails
                            processFile={({ file }) => ({
                                file,
                                key: `${Date.now()}-${file.name}`,
                            })}
                        />
                    </FormControl>

                    <TextField label="Autor" fullWidth value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} />

                    <TextField label="Categoría" fullWidth value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />

                    <TextField label="Resumen" fullWidth multiline rows={3} value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} />

                    <FormControlLabel
                        control={
                            <Switch checked={formData.isPublished} onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} />
                        }
                        label="Publicado (Visible en el sitio)"
                    />
                </Box>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={handleCancel} color="inherit">Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleInternalSave}
                    disabled={uploading}
                    startIcon={uploading && <Preloader />}
                >
                    {article ? 'Guardar Cambios' : 'Crear Artículo'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};