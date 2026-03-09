import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { uploadData, remove } from "aws-amplify/storage";
import {
    Button,
    TextField,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
    Avatar,
    IconButton,
    Grid,
    Typography,
    FormHelperText,
    InputAdornment
} from "@mui/material";
import { Camera, Save, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import RichTextEditorInpt from "@src/components/forms/RichTextEditor";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";
import { Preloader } from "@src/components/preloader";
import { moveIconToDefinitiveFolder } from "../../helpers/moveIconToDefinitiveFolder";
import { getUrl } from "aws-amplify/storage";

// ==================== CONSTANTS ====================
const TEMP_FOLDER = "research/temp/";
const CATEGORIES = ['Ranking General', 'Indicadores Específicos', 'Mejores Grupos'];
const SUB_CATEGORIES = ['Universidades', 'Colegios', 'Organizaciones'];

const INITIAL_FORM_STATE = {
    title: "",
    path: "",
    description: "",
    category: "",
    subCategory: "",
    icon: "",
};

// ==================== UTILITIES ====================
const generatePath = (title) => {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
};

// ==================== MAIN COMPONENT ====================
export function ResearchForm({ research, onClose, store }) {
    const rteRefDesc = useRef(null);

    const [form, setForm] = useState(INITIAL_FORM_STATE);
    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    // ==================== COMPUTED VALUES ====================
    const getCurrentDescription = useCallback(() => {
        return rteRefDesc.current?.editor?.getHTML() || "";
    }, []);

    // ==================== INITIALIZATION ====================
    useEffect(() => {
        const loadData = async () => {
            if (research) {
                setForm({
                    title: research.title || "",
                    path: research.path || "",
                    description: research.description || "",
                    category: research.category || "",
                    subCategory: research.subCategory || "",
                    icon: research.icon || "",
                });

                if (research.icon) {
                    try {
                        // Si ya tiene icono, obtenemos la URL firmada para mostrarlo
                        const url = await getUrl({ path: research.icon });
                        setIconPreview(url.url.toString());
                    } catch (e) {
                        console.error("Error loading icon", e);
                    }
                }
            }
            setIsInitialized(true);
        };
        loadData();
    }, [research]);

    // ==================== EVENT HANDLERS ====================
    const handleFieldChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Limpiar error al escribir
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setForm(prev => ({
            ...prev,
            title: newTitle,
            // Si es nuevo registro, autogeneramos el path. Si es edición, respetamos lo que haya.
            path: !research?.id ? generatePath(newTitle) : prev.path
        }));
    };

    // --- NUEVA LÓGICA DE SUBIDA DE IMAGEN (Estilo Perfil) ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const path = `${TEMP_FOLDER}${Date.now()}-${file.name}`;

            // 1. Subir a Temp
            const result = await uploadData({
                path,
                data: file,
                // options: { accessLevel: 'guest' } // Descomentar si usas public/guest
            }).result;

            // 2. Previsualización inmediata
            const objectUrl = URL.createObjectURL(file);
            setIconPreview(objectUrl);

            // 3. Actualizar form
            handleFieldChange("icon", result.path);

        } catch (error) {
            console.error("Error uploading image:", error);
            setErrors(prev => ({ ...prev, icon: "Error al subir la imagen" }));
        } finally {
            setUploading(false);
        }
    };

    // ==================== SAVE LOGIC ====================
    const handleSave = async () => {
        // 1. Validaciones
        const currentDesc = getCurrentDescription();
        const newErrors = {};
        if (!form.title) newErrors.title = "El título es obligatorio";
        if (!form.path) newErrors.path = "El path es obligatorio";
        if (!currentDesc || currentDesc === '<p></p>') newErrors.description = "La descripción es obligatoria";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setUploading(true);

            // Variable local para la ruta final
            let finalIcon = form.icon;

            // 2. CRÍTICO: Solo intentamos mover si la ruta actual contiene la carpeta temporal
            if (form.icon && form.icon.includes(TEMP_FOLDER)) {

                // Movemos el archivo físico en S3
                finalIcon = await moveIconToDefinitiveFolder(TEMP_FOLDER, form.icon, form.title);

                // 🔥 IMPORTANTE: Actualizamos el estado INMEDIATAMENTE.
                // Así, si falla el guardado en BD (paso 3), el formulario ya sabe 
                // que la imagen está en la carpeta definitiva y no intentará moverla de nuevo.
                setForm(prev => ({ ...prev, icon: finalIcon }));

                // Borrar imagen vieja si existía, era distinta y no es la que acabamos de subir
                if (research?.icon && research.icon !== finalIcon) {
                    await remove({ path: research.icon }).catch(e => console.warn("No se pudo borrar imagen anterior:", e));
                }
            }

            // 3. Preparar objeto para Base de Datos
            const researchData = {
                ...form,
                icon: finalIcon, // Usamos la variable local actualizada
                description: currentDesc,
                version: (research?.version || 0) + 1
            };

            const { errors: saveErrors, research: researchDB } = await store(
                researchData,
                research?.id
            );

            if (saveErrors) {
                setErrors(saveErrors);
                // No necesitamos revertir la imagen. Si el usuario guarda de nuevo, 
                // el `if` de arriba saltará el movimiento porque `form.icon` ya no tiene `TEMP_FOLDER`.
            } else {
                onClose(researchDB);
            }
        } catch (error) {
            console.error("Error saving:", error);
            setErrors({ submit: "Error inesperado al guardar: " + (error.message || error) });
        } finally {
            setUploading(false);
        }
    };

    if (!isInitialized) return <Preloader />;

    return (
        <Dialog open onClose={() => onClose()} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    {research?.id ? "Editar Investigación" : "Nueva Investigación"}
                </Typography>
                <IconButton onClick={() => onClose()} size="small"><X size={20} /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={4}>

                    {/* --- 1. SECCIÓN DE IMAGEN (ESTILO PERFIL) --- */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative">
                            <Avatar
                                src={iconPreview}
                                variant="rounded" // O "circular" si prefieres círculo perfecto
                                sx={{
                                    width: 120, height: 120,
                                    bgcolor: 'grey.100',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                <ImageIcon size={40} className="text-gray-300" />
                            </Avatar>

                            {/* Input oculto + Botón de cámara */}
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="icon-button-file"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="icon-button-file">
                                <Box
                                    sx={{
                                        position: 'absolute', bottom: -10, right: -10,
                                        bgcolor: 'primary.main', borderRadius: '50%', p: 1,
                                        cursor: 'pointer', border: '4px solid white',
                                        boxShadow: 1,
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }}
                                >
                                    <Camera size={20} color="white" />
                                </Box>
                            </label>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                            Logo o Portada de la Investigación
                        </Typography>
                    </Box>

                    {/* --- 2. CAMPOS DEL FORMULARIO --- */}
                    <Grid container spacing={3}>
                        <Grid size={{ sx: 12, md: 6 }}>
                            <TextField
                                label="Título de la Investigación"
                                value={form.title}
                                onChange={handleTitleChange}
                                fullWidth
                                required
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Grid>
                        <Grid size={{ sx: 12, md: 6 }}>
                            <TextField
                                label="URL (Path)"
                                value={form.path}
                                onChange={(e) => handleFieldChange("path", e.target.value)}
                                fullWidth
                                required
                                error={!!errors.path}
                                helperText={errors.path}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LinkIcon size={16} /></InputAdornment>
                                }}
                            />
                        </Grid>

                        <Grid size={{ sx: 12, md: 6 }}>
                            <Autocomplete
                                options={CATEGORIES}
                                value={form.category || null}
                                onChange={(_, val) => handleFieldChange("category", val)}
                                renderInput={(params) => <TextField {...params} label="Categoría" error={!!errors.category} />}
                            />
                        </Grid>
                        <Grid size={{ sx: 12, md: 6 }}>
                            <Autocomplete
                                options={SUB_CATEGORIES}
                                value={form.subCategory || null}
                                onChange={(_, val) => handleFieldChange("subCategory", val)}
                                renderInput={(params) => <TextField {...params} label="Subcategoría" error={!!errors.subCategory} />}
                            />
                        </Grid>

                        <Grid size={{ sx: 12 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>
                                Descripción Detallada
                            </Typography>
                            <Box sx={{
                                border: !!errors.description ? '1px solid #d32f2f' : '1px solid #e0e0e0',
                                borderRadius: 2, overflow: 'hidden'
                            }}>
                                <RichTextEditorInpt
                                    rteRef={rteRefDesc}
                                    content={form.description}
                                />
                            </Box>
                            {errors.description && (
                                <FormHelperText error sx={{ mx: 2 }}>{errors.description}</FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                <Button onClick={() => onClose()} color="inherit" sx={{ textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={uploading}
                    startIcon={uploading ? <Preloader size={16} /> : <Save size={18} />}
                    sx={{ px: 4, textTransform: 'none', borderRadius: 2 }}
                >
                    {uploading ? "Guardando..." : "Guardar Investigación"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}