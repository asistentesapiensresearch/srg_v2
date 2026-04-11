import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Grid, Paper,
    TextField, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, ImageList, ImageListItem, ImageListItemBar,
    Divider
} from '@mui/material';
import { Plus, Type, Trash2, Image as ImageIcon, Save, X } from 'lucide-react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { Preloader } from '@src/components/preloader';

// Importamos nuestro nuevo hook
import { useGalleries } from './hooks/useGalleries';
import { StorageImage } from '@aws-amplify/ui-react-storage';

const GALLERY_PATH = "galleries/";

export default function GalleryManager() {
    const { galleries, loading, fetchGalleries, storeGallery, deleteGallery } = useGalleries();

    // Estados de UI
    const [openModal, setOpenModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Estados del Formulario
    const [currentGallery, setCurrentGallery] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]); // Array de objetos: { key (S3), url (Blob/Firmada), isNew (boolean), file (File) }

    // Agregamos estados para controlar modal de descripción por imagen
    const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [imageDescription, setImageDescription] = useState("");

    // Cargar galerías al montar
    useEffect(() => {
        fetchGalleries();
    }, [fetchGalleries]);

    // --- MANEJO DEL MODAL ---
    const handleOpen = async (gallery = null) => {
        setErrorMsg("");
        if (gallery) {
            setCurrentGallery(gallery);
            setName(gallery.name);
            setDescription(gallery.description || "");

            // Parsear el JSON de imágenes guardado en la BD
            let parsedImages = [];
            try {
                parsedImages = typeof gallery.images === 'string' ? JSON.parse(gallery.images) : gallery.images;
            } catch (e) { console.error("Error parseando imágenes", e); }

            // Obtener URLs firmadas de S3 para mostrarlas en la vista previa
            const withUrls = await Promise.all(parsedImages.map(async (img) => {
                try {
                    const res = await getUrl({ path: img.original });
                    return { key: img.original, url: res.url.toString(), isNew: false, description: img.description || "" };
                } catch (err) {
                    return { key: img.original, url: "", isNew: false, description: img.description || "" }; // Fallback si la imagen no existe
                }
            }));
            setImages(withUrls);
        } else {
            setCurrentGallery(null);
            setName("");
            setDescription("");
            setImages([]);
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        // Limpiar blobs de memoria para evitar memory leaks
        images.forEach(img => {
            if (img.isNew && img.url) URL.revokeObjectURL(img.url);
        });
        setOpenModal(false);
    };

    // --- MANEJO DE IMÁGENES LOCALES ---
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const newImages = files.map(file => ({
            key: null, // Aún no tiene key en S3
            url: URL.createObjectURL(file), // Preview local
            isNew: true,
            file: file,
            description: ""
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        const imgToRemove = images[index];
        if (imgToRemove.isNew && imgToRemove.url) {
            URL.revokeObjectURL(imgToRemove.url);
        }
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleOpenAddDescription = (index) => {
        const selectedImage = images[index];
        setSelectedImageIndex(index);
        setImageDescription(selectedImage.description || "");
        setOpenDescriptionModal(true);
    }

    // save descriptionImg
    const handleSaveImageDescription = () => {
        if (selectedImageIndex === null) return;

        setImages(prev =>
            prev.map((img, i) =>
                i === selectedImageIndex
                    ? { ...img, description: imageDescription }
                    : img
            )
        );

        setOpenDescriptionModal(false);
        setSelectedImageIndex(null);
        setImageDescription("");
    };

    // close descriptionImg modal
    const handleCloseDescriptionModal = () => {
        setOpenDescriptionModal(false);
        setSelectedImageIndex(null);
        setImageDescription("");
    };

    // --- GUARDAR EN S3 Y LUEGO EN BD ---
    const handleSave = async () => {
        if (!name.trim()) {
            setErrorMsg("El nombre de la galería es obligatorio.");
            return;
        }
        if (images.length === 0) {
            setErrorMsg("Debes agregar al menos una imagen.");
            return;
        }

        setUploading(true);
        setErrorMsg("");

        try {
            const finalImagesPayload = [];

            // 1. Subir a S3 las imágenes nuevas
            for (const img of images) {
                if (img.isNew && img.file) {
                    const fileKey = `${GALLERY_PATH}${Date.now()}-${img.file.name.replace(/\s+/g, '_')}`;
                    await uploadData({ path: fileKey, data: img.file }).result;

                    finalImagesPayload.push({
                        original: fileKey,
                        thumbnail: fileKey, // Aquí podrías enviar a generar un thumbnail si tuvieras Lambda
                        description: img.description || ""
                    });
                } else if (!img.isNew && img.key) {
                    // Mantener las que ya estaban en S3
                    finalImagesPayload.push({
                        original: img.key,
                        thumbnail: img.key,
                        description: img.description || ""
                    });
                }
            }

            // 2. Preparar el objeto para tu caso de uso / repositorio
            const payload = {
                name,
                description,
                type: 'General', // Opcional: podrías agregar un select en el form
                images: JSON.stringify(finalImagesPayload) // Guardamos como JSON String
            };

            // 3. Guardar en Base de Datos usando nuestro hook
            const { success, errors } = await storeGallery(payload, currentGallery?.id);

            if (success) {
                handleClose();
            } else {
                setErrorMsg(errors?.form || "Ocurrió un error al guardar.");
            }

        } catch (error) {
            console.error("Error en handleSave:", error);
            setErrorMsg("Error inesperado al subir las imágenes.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta galería permanentemente?")) {
            await deleteGallery(id);
        }
    };

    // --- RENDER ---
    return (
        <Container maxWidth="xl" className="py-8">
            {/* Cabecera */}
            <Box className="flex justify-between items-center mb-8">
                <Box>
                    <Typography variant="h5" fontWeight="bold">Gestor de Galerías</Typography>
                    <Typography variant="body2" color="text.secondary">Crea y administra colecciones de fotos</Typography>
                </Box>
                <Button variant="contained" color="primary" startIcon={<Plus />} onClick={() => handleOpen()} sx={{ borderRadius: 2 }}>
                    Nueva Galería
                </Button>
            </Box>

            {/* Listado de Galerías */}
            {loading ? (
                <Box className="flex justify-center py-10"><Preloader /></Box>
            ) : galleries.length === 0 ? (
                <Paper className="py-16 text-center border border-dashed border-gray-300 bg-gray-50 rounded-xl" elevation={0}>
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <Typography variant="h6" color="text.secondary">No hay galerías creadas</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-4">Comienza creando tu primera colección de fotos.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {galleries.map(gallery => {
                        let parsed = [];
                        try { parsed = typeof gallery.images === 'string' ? JSON.parse(gallery.images) : gallery.images; } catch (e) { }
                        const count = parsed?.length || 0;

                        return (
                            <Grid size={{ sx: 12, sm: 6, md: 4, lg: 3 }} key={gallery.id}>
                                <Paper className="p-0 overflow-hidden hover:shadow-lg transition-shadow border border-gray-100" elevation={0}>
                                    <Box className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                        {/* 1. Lógica para extraer la portada */}
                                        {(() => {
                                            let parsed = [];
                                            try {
                                                parsed = typeof gallery.images === 'string' ? JSON.parse(gallery.images) : gallery.images;
                                            } catch (e) { }

                                            const count = parsed?.length || 0;
                                            const coverImageKey = count > 0 ? parsed[0].original : null; // Tomamos la primera imagen

                                            return (
                                                <>
                                                    {/* 2. Renderizado Condicional: Imagen o Icono por defecto */}
                                                    {coverImageKey ? (
                                                        <StorageImage
                                                            alt={`Portada de ${gallery.name}`}
                                                            path={coverImageKey}
                                                            className="object-cover w-[350px]"
                                                        />
                                                    ) : (
                                                        <ImageIcon size={40} className="text-gray-300" />
                                                    )}

                                                    {/* Contador de fotos encima de la imagen */}
                                                    <Box className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs z-10">
                                                        {count} fotos
                                                    </Box>
                                                </>
                                            );
                                        })()}
                                    </Box>
                                    <Box className="p-4">
                                        <Typography fontWeight="bold" noWrap>{gallery.name}</Typography>
                                        <Typography variant="caption" color="text.secondary" className="mb-3 block line-clamp-2">
                                            {gallery.description || "Sin descripción"}
                                        </Typography>
                                        <Divider className="my-2" />
                                        <Box className="flex justify-between mt-2">
                                            <Button size="small" variant="text" onClick={() => handleOpen(gallery)}>Editar</Button>
                                            <Button size="small" color="error" onClick={() => handleDelete(gallery.id)}>Eliminar</Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Modal de Edición / Creación */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight="bold">
                        {currentGallery ? "Editar Galería" : "Nueva Galería"}
                    </Typography>
                    <IconButton onClick={handleClose} size="small"><X size={20} /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    {errorMsg && (
                        <Box className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
                            {errorMsg}
                        </Box>
                    )}

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nombre de la Galería"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Descripción (Opcional)"
                                fullWidth
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Box className="mt-6 mb-4 flex justify-between items-center">
                        <Typography variant="subtitle1" fontWeight="bold">Imágenes ({images.length})</Typography>

                        <input
                            accept="image/*" style={{ display: 'none' }} id="gallery-upload"
                            multiple type="file" onChange={handleFileSelect}
                        />
                        <label htmlFor="gallery-upload">
                            <Button variant="outlined" component="span" startIcon={<ImageIcon size={18} />} size="small">
                                Agregar Fotos
                            </Button>
                        </label>
                    </Box>

                    {/* Grilla de Miniaturas */}
                    <Box className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 min-h-[200px]">
                        {images.length === 0 ? (
                            <Box className="h-full flex flex-col items-center justify-center text-gray-400">
                                <ImageIcon size={40} className="mb-2 opacity-50" />
                                <Typography variant="body2">Sube imágenes para tu galería</Typography>
                            </Box>
                        ) : (
                            <ImageList cols={4} rowHeight={140} gap={12}>
                                {images.map((item, index) => (
                                    <ImageListItem key={index} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group">
                                        <img
                                            src={item.url}
                                            alt={`Img ${index}`}
                                            loading="lazy"
                                            style={{ height: '100%', objectFit: 'cover' }}
                                        />

                                        <Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            
                                            {/* Botón eliminar */}
                                            <IconButton
                                                sx={{
                                                    color: 'white',
                                                    bgcolor: 'rgba(239, 68, 68, 0.8)',
                                                    '&:hover': { bgcolor: 'red' }
                                                }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                            <Trash2 size={20} />
                                            </IconButton>

                                            {/* Botón agregar descripción */}
                                            <IconButton
                                                sx={{
                                                    color: 'white',
                                                    bgcolor: 'rgba(20, 68, 68, 0.8)',
                                                    '&:hover': { bgcolor: 'green' }
                                                }}
                                                onClick={() => handleOpenAddDescription(index)}
                                            >
                                                {/* cambia el icono si quieres */}
                                                <Type size={20} />
                                            </IconButton>

                                        </Box>

                                        {/* Etiqueta de "Nuevo" */}
                                        {item.isNew && (
                                            <Box className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                                                NUEVA
                                            </Box>
                                        )}
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                    <Button onClick={handleClose} color="inherit" sx={{ textTransform: 'none' }}>Cancelar</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={uploading}
                        startIcon={uploading ? <Preloader size={16} /> : <Save size={18} />}
                        sx={{ px: 4, textTransform: 'none', borderRadius: 2 }}
                    >
                        {uploading ? "Subiendo imágenes..." : "Guardar Galería"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal para agregar descripción de la imagen */}
            <Dialog
                open={openDescriptionModal}
                onClose={handleCloseDescriptionModal}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle>
                    <Typography fontWeight="bold">
                        Agregar descripción
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Descripción de la imagen"
                        fullWidth
                        multiline
                        rows={4}
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        placeholder="Escribe un texto para esta imagen"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleCloseDescriptionModal} color="inherit">
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleSaveImageDescription}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}