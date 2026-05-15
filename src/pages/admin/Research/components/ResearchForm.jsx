import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { uploadData, remove, getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
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
import { Preloader } from "@src/components/preloader";
import { moveIconToDefinitiveFolder } from "../../helpers/moveIconToDefinitiveFolder";

const client = generateClient();
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
    parentId: "",
};

const generatePath = (title) => {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
};

export function ResearchForm({ research, onClose, store }) {
    const rteRefDesc = useRef(null);
    const [form, setForm] = useState(INITIAL_FORM_STATE);
    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [availableResearches, setAvailableResearches] = useState([]);

    const getCurrentDescription = useCallback(() => {
        return rteRefDesc.current?.editor?.getHTML() || "";
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { data: list } = await client.models.Research.list();
                setAvailableResearches(list);

                if (research) {
                    setForm({
                        title: research.title || "",
                        path: research.path || "",
                        description: research.description || "",
                        category: research.category || "",
                        subCategory: research.subCategory || "",
                        icon: research.icon || "",
                        parentId: research.parentId || "",
                    });

                    if (research.icon) {
                        try {
                            const url = await getUrl({ path: research.icon });
                            setIconPreview(url.url.toString());
                        } catch (e) {
                            console.error("Error loading icon", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Error in initialization:", error);
            } finally {
                setIsInitialized(true);
            }
        };
        loadInitialData();
    }, [research]);

    const parentOptions = useMemo(() => {
        return availableResearches
            .filter(r => r.id !== research?.id)
            .map(r => ({
                label: r.title,
                value: r.id,
                category: r.category
            }));
    }, [availableResearches, research]);

    const handleFieldChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setForm(prev => ({
            ...prev,
            title: newTitle,
            path: !research?.id ? generatePath(newTitle) : prev.path
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const path = `${TEMP_FOLDER}${Date.now()}-${file.name}`;
            const result = await uploadData({ path, data: file }).result;
            const objectUrl = URL.createObjectURL(file);
            setIconPreview(objectUrl);
            handleFieldChange("icon", result.path);
        } catch (error) {
            console.error("Error uploading image:", error);
            setErrors(prev => ({ ...prev, icon: "Error al subir la imagen" }));
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        const currentDesc = getCurrentDescription();
        const newErrors = {};

        if (!form.title) newErrors.title = "El título es obligatorio";
        if (!form.path) newErrors.path = "El path es obligatorio";
        if (!currentDesc || currentDesc === '<p></p>') newErrors.description = "La descripción es obligatoria";

        if (form.category && form.category !== 'Ranking General' && !form.parentId) {
            newErrors.parentId = "Debe seleccionar la investigación principal a la que pertenece";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setUploading(true);
            let finalIcon = form.icon;

            if (form.icon && form.icon.includes(TEMP_FOLDER)) {
                finalIcon = await moveIconToDefinitiveFolder(TEMP_FOLDER, form.icon, form.title);
                setForm(prev => ({ ...prev, icon: finalIcon }));
                if (research?.icon && research.icon !== finalIcon) {
                    await remove({ path: research.icon }).catch(() => null);
                }
            }

            const researchData = {
                ...form,
                icon: finalIcon,
                description: currentDesc,
                parentId: form.category === 'Ranking General' ? null : form.parentId,
                version: (research?.version || 0) + 1
            };

            const { errors: saveErrors, research: researchDB } = await store(
                researchData,
                research?.id
            );

            if (saveErrors) {
                setErrors(saveErrors);
            } else {
                onClose(researchDB);
            }
        } catch (error) {
            console.error("Error saving:", error);
            setErrors({ submit: "Error inesperado al guardar." });
        } finally {
            setUploading(false);
        }
    };

    if (!isInitialized) return <Preloader />;

    return (
        <Dialog open onClose={() => onClose()} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight="bold">
                    {research?.id ? "Editar Investigación" : "Nueva Investigación"}
                </Typography>
                <IconButton onClick={() => onClose()} size="small"><X size={20} /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative">
                            <Avatar
                                src={iconPreview}
                                variant="rounded"
                                sx={{ width: 120, height: 120, bgcolor: 'grey.100', border: '1px solid #e0e0e0' }}
                            >
                                <ImageIcon size={40} className="text-gray-300" />
                            </Avatar>
                            <input accept="image/*" style={{ display: 'none' }} id="icon-file" type="file" onChange={handleImageUpload} />
                            <label htmlFor="icon-file">
                                <Box sx={{
                                    position: 'absolute', bottom: -10, right: -10,
                                    bgcolor: 'primary.main', borderRadius: '50%', p: 1,
                                    cursor: 'pointer', border: '4px solid white', boxShadow: 2
                                }}>
                                    <Camera size={20} color="white" />
                                </Box>
                            </label>
                        </Box>
                    </Box>

                    {/* Implementación de Grid v2 */}
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField label="Título" value={form.title} onChange={handleTitleChange} fullWidth required error={!!errors.title} helperText={errors.title} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="URL (Path)"
                                value={form.path}
                                onChange={(e) => handleFieldChange("path", e.target.value)}
                                fullWidth required error={!!errors.path} helperText={errors.path}
                                InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon size={16} /></InputAdornment> }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Autocomplete
                                options={CATEGORIES}
                                value={form.category || null}
                                onChange={(_, val) => {
                                    handleFieldChange("category", val);
                                    if (val === 'Ranking General') handleFieldChange("parentId", "");
                                }}
                                renderInput={(params) => <TextField {...params} label="Categoría" error={!!errors.category} />}
                            />
                        </Grid>

                        {form.category && form.category !== 'Ranking General' && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Autocomplete
                                    options={parentOptions}
                                    value={parentOptions.find(o => o.value === form.parentId) || null}
                                    onChange={(_, val) => handleFieldChange("parentId", val?.value || "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pertenece a (Investigación Principal)"
                                            error={!!errors.parentId}
                                            helperText={errors.parentId}
                                            required
                                        />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Autocomplete
                                options={SUB_CATEGORIES}
                                value={form.subCategory || null}
                                onChange={(_, val) => handleFieldChange("subCategory", val)}
                                renderInput={(params) => <TextField {...params} label="Subcategoría" />}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>Descripción</Typography>
                            <Box sx={{ border: !!errors.description ? '1px solid #d32f2f' : '1px solid #e0e0e0', borderRadius: 2 }}>
                                <RichTextEditorInpt rteRef={rteRefDesc} content={form.description} />
                            </Box>
                            {errors.description && <FormHelperText error sx={{ mx: 2 }}>{errors.description}</FormHelperText>}
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                <Button onClick={() => onClose()} color="inherit">Cancelar</Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={uploading}
                    startIcon={uploading ? <Preloader size={16} /> : <Save size={18} />}
                >
                    {uploading ? "Guardando..." : "Guardar Investigación"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}