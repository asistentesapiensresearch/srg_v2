import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Button, Grid, Paper,
    TextField, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Avatar, Tooltip, Divider
} from '@mui/material';
import { Plus, Trash2, Edit, X, Save, ArrowLeft, Camera, Quote, User } from 'lucide-react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Preloader } from '@src/components/preloader';

// Importamos el hook que conecta con los Casos de Uso (Arquitectura Limpia)
import { useTestimonials } from './hooks/useTestimonials';

const TESTIMONIALS_PATH = "shared/testimonials/"; // Asegúrate de que esta ruta tenga permisos en tu defineStorage

export default function TestimonialManager() {
    // 1. Obtenemos el ID de la entidad (institución) de la URL
    // Asumiendo que tu ruta es: /admin/institutions/:id/testimonials
    const { id: institutionId } = useParams();
    const navigate = useNavigate();

    // 2. Instanciamos nuestro Hook de Casos de Uso
    const { testimonials, loading, fetchTestimonials, storeTestimonial, deleteTestimonial } = useTestimonials(institutionId);

    console.log('testimonials', testimonials)

    // Estados de UI
    const [openModal, setOpenModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [previewUrls, setPreviewUrls] = useState({}); // Mapeo de S3 Keys a URLs firmadas para la lista

    // Estados del Formulario
    const [currentId, setCurrentId] = useState(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [content, setContent] = useState("");

    // Estado para la foto
    const [photoFile, setPhotoFile] = useState(null); // Archivo físico si se selecciona uno nuevo
    const [photoPreview, setPhotoPreview] = useState(""); // URL para mostrar en el modal (local o de S3)
    const [existingPhotoKey, setExistingPhotoKey] = useState(""); // Si ya tenía foto en S3

    // Cargar testimonios al montar
    useEffect(() => {
        if (institutionId) fetchTestimonials();
    }, [institutionId, fetchTestimonials]);

    // Generar URLs firmadas para la lista principal
    useEffect(() => {
        const loadPreviews = async () => {
            const urls = {};
            for (const t of testimonials) {
                if (t.photo) {
                    try {
                        const res = await getUrl({ path: t.photo });
                        urls[t.id] = res.url.toString();
                    } catch (e) {
                        urls[t.id] = "";
                    }
                }
            }
            setPreviewUrls(urls);
        };
        if (testimonials.length > 0) loadPreviews();
    }, [testimonials]);

    // --- MANEJO DEL MODAL ---
    const handleOpen = async (testimonial = null) => {
        setErrorMsg("");
        setPhotoFile(null);

        if (testimonial) {
            setCurrentId(testimonial.id);
            setName(testimonial.name);
            setRole(testimonial.role || "");
            setContent(testimonial.content);
            setExistingPhotoKey(testimonial.photo || "");

            if (testimonial.photo) {
                try {
                    const res = await getUrl({ path: testimonial.photo });
                    setPhotoPreview(res.url.toString());
                } catch (err) {
                    setPhotoPreview("");
                }
            } else {
                setPhotoPreview("");
            }
        } else {
            setCurrentId(null);
            setName("");
            setRole("");
            setContent("");
            setExistingPhotoKey("");
            setPhotoPreview("");
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        if (photoFile && photoPreview) URL.revokeObjectURL(photoPreview); // Limpiar memoria
        setOpenModal(false);
    };

    // --- MANEJO DE FOTO LOCAL ---
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Liberar la preview anterior si era un blob
        if (photoFile && photoPreview) URL.revokeObjectURL(photoPreview);

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    // --- GUARDAR EN S3 Y LUEGO EN BD ---
    const handleSave = async () => {
        if (!name.trim() || !content.trim()) {
            setErrorMsg("El nombre y el contenido son obligatorios.");
            return;
        }

        setUploading(true);
        setErrorMsg("");

        try {
            let finalPhotoKey = existingPhotoKey;

            // 1. Subir a S3 si hay una foto nueva
            if (photoFile) {
                const fileKey = `${TESTIMONIALS_PATH}${institutionId}/${Date.now()}-${photoFile.name.replace(/\s+/g, '_')}`;
                await uploadData({ path: fileKey, data: photoFile }).result;
                finalPhotoKey = fileKey;
            }

            // 2. Preparar el DTO (Data Transfer Object) para el Caso de Uso
            const payload = {
                institutionId,
                name,
                role,
                content,
                photo: finalPhotoKey
            };

            // 3. Ejecutar Caso de Uso (Arquitectura Limpia)
            const { success, errors } = await storeTestimonial(payload, currentId);

            if (success) {
                handleClose();
            } else {
                setErrorMsg(errors?.form || Object.values(errors).join(", ") || "Error al guardar.");
            }

        } catch (error) {
            console.error("Error en handleSave:", error);
            setErrorMsg("Error inesperado al guardar el testimonio.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este testimonio?")) {
            await deleteTestimonial(id);
        }
    };

    // --- RENDER ---
    return (
        <Container maxWidth="lg" className="py-8">
            {/* Cabecera */}
            <Box className="flex justify-between items-center mb-8">
                <Box className="flex items-center gap-3">
                    <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <ArrowLeft size={20} />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">Gestor de Testimonios</Typography>
                        <Typography variant="body2" color="text.secondary">Administra las reseñas de esta entidad</Typography>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: 2 }}
                >
                    Nuevo Testimonio
                </Button>
            </Box>

            {/* Listado */}
            {loading ? (
                <Box className="flex justify-center py-10"><Preloader /></Box>
            ) : testimonials.length === 0 ? (
                <Paper className="py-16 text-center border border-dashed border-gray-300 bg-gray-50 rounded-xl" elevation={0}>
                    <Quote size={48} className="mx-auto text-gray-300 mb-4" />
                    <Typography variant="h6" color="text.secondary">No hay testimonios registrados</Typography>
                    <Typography variant="body2" color="text.secondary" className="mb-4">Agrega reseñas y comentarios de miembros o clientes.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {testimonials.map(t => (
                        <Grid size={{ sx: 12, sm: 6, md: 4 }} key={t.id}>
                            <Paper className="p-5 hover:shadow-lg transition-shadow border border-gray-100 relative rounded-xl h-full flex flex-col" elevation={0}>
                                <Quote size={24} className="absolute top-4 right-4 text-gray-200" />

                                <Typography variant="body2" color="text.secondary" className="mb-4 italic grow line-clamp-4">
                                    "{t.content}"
                                </Typography>

                                <Divider className="my-3" />

                                <Box className="flex justify-between items-end">
                                    <Box className="flex items-center gap-3">
                                        <Avatar src={previewUrls[t.id]} alt={t.name} sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                                            {t.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold" className="leading-tight">{t.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{t.role || "Sin rol especificado"}</Typography>
                                        </Box>
                                    </Box>
                                    <Box className="flex gap-1">
                                        <Tooltip title="Editar">
                                            <IconButton size="small" onClick={() => handleOpen(t)} className="text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                                                <Edit size={16} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton size="small" onClick={() => handleDelete(t.id)} className="text-gray-500 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Modal de Edición / Creación */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography fontWeight="bold">
                        {currentId ? "Editar Testimonio" : "Nuevo Testimonio"}
                    </Typography>
                    <IconButton onClick={handleClose} size="small"><X size={20} /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ py: 3 }}>
                    {errorMsg && (
                        <Box className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
                            {errorMsg}
                        </Box>
                    )}

                    <Box className="flex flex-col items-center mb-6">
                        <Box className="relative group cursor-pointer">
                            <Avatar
                                src={photoPreview}
                                sx={{ width: 80, height: 80, bgcolor: 'grey.200', fontSize: '2rem' }}
                            >
                                {name ? name.charAt(0) : <User size={40} className="text-gray-400" />}
                            </Avatar>

                            <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={24} />
                            </label>
                            <input
                                accept="image/*" style={{ display: 'none' }} id="avatar-upload"
                                type="file" onChange={handleFileSelect}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            Foto de perfil (Opcional)
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Rol o Relación (Opcional)"
                                placeholder="Ej: Exalumno, Padre de familia, Egresado 2020"
                                fullWidth
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Testimonio"
                                fullWidth
                                multiline
                                rows={4}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
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
                        {uploading ? "Guardando..." : "Guardar Testimonio"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}