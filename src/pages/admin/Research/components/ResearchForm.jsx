import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { remove } from "aws-amplify/storage";
import {
    Button,
    TextField,
    CircularProgress,
    FormGroup,
    Box,
    Dialog,
    DialogTitle,
    Autocomplete,
    FormHelperText,
} from "@mui/material";
import RichTextEditorInpt from "@src/components/forms/RichTextEditor";
import BrandComponent from "@src/components/forms/BrandComponent";
import UploadInputForm from "@src/components/forms/UploadInputForm";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";
import { moveIconToDefinitiveFolder } from "../../helpers/moveIconToDefinitiveFolder";

// ==================== CONSTANTS ====================
const TEMP_FOLDER = "research/temp/";
const ACCEPTED_FILE_TYPES = ["image/*"];
const CATEGORIES = ['Ranking General', 'Indicadores Específicos', 'Mejores Grupos'];
const SUB_CATEGORIES = ['Universidades', 'Colegios', 'Organizaciones'];

const INITIAL_FORM_STATE = {
    title: "",
    path: "",
    description: "",
    dateRange: "",
    brands: [],
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
    const [initialForm, setInitialForm] = useState(null);

    // ==================== COMPUTED VALUES ====================
    const getCurrentDescription = useCallback(() => {
        return rteRefDesc.current?.editor?.getHTML() || "";
    }, []);

    const hasChanges = useMemo(() => {
        if (!isInitialized || !initialForm) return false;

        const formChanged = Object.keys(form).some(key => {
            if (key === 'brands') {
                return JSON.stringify(form[key]) !== JSON.stringify(initialForm[key]);
            }
            return form[key] !== initialForm[key];
        });

        const currentDesc = getCurrentDescription();
        const descChanged = currentDesc !== initialForm.description;

        return formChanged || descChanged;
    }, [form, isInitialized, initialForm, getCurrentDescription]);

    // ==================== INITIALIZATION ====================
    useEffect(() => {
        const initialData = {
            title: research?.title || "",
            path: research?.path || "",
            description: research?.description || "",
            dateRange: research?.dateRange || "",
            brands: research?.brands || [],
            category: research?.category || "",
            subCategory: research?.subCategory || "",
            icon: research?.icon || "",
        };

        setForm(initialData);
        setInitialForm(initialData);
        setIconPreview(research?.icon || "");
        setIsInitialized(true);
    }, [research]);

    // ==================== VALIDATION ====================
    const validateForm = useCallback(() => {
        const newErrors = {};
        const description = getCurrentDescription();

        if (!description?.trim() || description === '<p></p>') {
            newErrors.description = "La descripción es obligatoria.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [getCurrentDescription]);

    // ==================== EVENT HANDLERS ====================
    const handleFieldChange = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleInputChange = useCallback((field) => (e) => {
        handleFieldChange(field, e.target.value);
    }, [handleFieldChange]);

    const handleTitleChange = useCallback((e) => {
        const newTitle = e.target.value;
        setForm(prev => ({
            ...prev,
            title: newTitle,
            path: generatePath(newTitle)
        }));
    }, []);

    const handleAutocompleteChange = useCallback((field) => (_, value) => {
        handleFieldChange(field, value || "");
    }, [handleFieldChange]);

    const handleBrandsChange = useCallback((brands) => {
        const brandIds = brands.map(item => item.id);
        handleFieldChange("brands", brandIds);
    }, [handleFieldChange]);

    const handleIconChange = useCallback((value) => {
        handleFieldChange("icon", value);
    }, [handleFieldChange]);

    // ==================== SAVE LOGIC ====================
    const handleSave = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setUploading(true);

            // Mover icono a carpeta definitiva si es necesario
            const finalIcon = await moveIconToDefinitiveFolder(TEMP_FOLDER, form.icon, form.title);
            // Si estamos editando y el ícono cambió (y no es el temporal), borramos el anterior
            if (research?.id && research.icon && research.icon !== finalIcon) {
                await remove({ path: research.icon });
            }
            setForm({
                ...form,
                icon: finalIcon
            });

            const researchData = {
                ...form,
                icon: finalIcon,
                description: getCurrentDescription(),
                version: (research?.version || 0) + 1
            };

            const { errors: saveErrors, research: researchDB } = await store(
                researchData,
                research?.id
            );

            if (saveErrors && Object.keys(saveErrors).length > 0) {
                setErrors(saveErrors);
                return;
            }

            onClose(researchDB);
        } catch (error) {
            console.error("Error saving research:", error);
            setErrors({ submit: error.message || "Error al guardar la investigación" });
        } finally {
            setUploading(false);
        }
    }, [form, validateForm, research, store, onClose, getCurrentDescription]);

    // ==================== DEBUG ====================
    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("ResearchForm", { research, onClose, form });
    }

    // ==================== LOADING STATE ====================
    if (!isInitialized) {
        return (
            <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
                <Box className="flex justify-center items-center p-8">
                    <CircularProgress />
                </Box>
            </Dialog>
        );
    }

    // ==================== RENDER ====================
    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {research?.id ? "Editar" : "Crear nueva"} investigación
            </DialogTitle>

            <Box className="px-4 pb-4 bg-white rounded-lg shadow-md">
                <FormGroup className="flex flex-col gap-6">
                    {/* TÍTULO */}
                    <TextField
                        label="Título"
                        value={form.title}
                        onChange={handleTitleChange}
                        fullWidth
                        required
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    {/* PATH */}
                    <TextField
                        label="Path (URL)"
                        value={form.path}
                        onChange={handleInputChange("path")}
                        fullWidth
                        required
                        error={!!errors.path}
                        helperText={
                            errors.path ||
                            "Se genera automáticamente desde el título. Solo minúsculas, números y guiones."
                        }
                        placeholder="ejemplo-de-path"
                    />

                    {/* RANGO DE FECHAS */}
                    <TextField
                        label="Rango de Fechas"
                        value={form.dateRange}
                        onChange={handleInputChange("dateRange")}
                        fullWidth
                        required
                        error={!!errors.dateRange}
                        helperText={errors.dateRange}
                    />

                    {/* CATEGORÍA Y SUBCATEGORÍA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Autocomplete
                                disablePortal
                                options={CATEGORIES}
                                value={form.category || null}
                                onChange={handleAutocompleteChange("category")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Categoría"
                                        required
                                        error={!!errors.category}
                                    />
                                )}
                                fullWidth
                            />
                            {errors.category && (
                                <FormHelperText error>{errors.category}</FormHelperText>
                            )}
                        </div>

                        <div>
                            <Autocomplete
                                disablePortal
                                options={SUB_CATEGORIES}
                                value={form.subCategory || null}
                                onChange={handleAutocompleteChange("subCategory")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Subcategoría"
                                        required
                                        error={!!errors.subCategory}
                                    />
                                )}
                                fullWidth
                            />
                            {errors.subCategory && (
                                <FormHelperText error>{errors.subCategory}</FormHelperText>
                            )}
                        </div>
                    </div>

                    {/* ÍCONO */}
                    <div>
                        <span className="text-sm font-medium text-gray-700">Logo</span>
                        <UploadInputForm
                            tempFolder={TEMP_FOLDER}
                            iconPreview={iconPreview}
                            setIconPreview={setIconPreview}
                            acceptedFileTypes={ACCEPTED_FILE_TYPES}
                            handleChange={handleIconChange}
                            setUploading={setUploading}
                            error={errors.icon}
                        />
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className={errors.description ? "border border-red-700 rounded-lg" : ""}>
                        <RichTextEditorInpt
                            placeholder="Descripción"
                            rteRef={rteRefDesc}
                            content={form.description}
                            onChange={validateForm}
                        />
                        {errors.description && (
                            <FormHelperText error>{errors.description}</FormHelperText>
                        )}
                    </div>

                    {/* Marcas */}
                    <BrandComponent onChange={handleBrandsChange} />

                    {/* ERROR GENERAL */}
                    {errors.submit && (
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    )}

                    {/* BOTONES */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onClose()}
                            disabled={uploading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            disabled={uploading || !hasChanges}
                            onClick={handleSave}
                            startIcon={uploading && <CircularProgress size={16} />}
                        >
                            {uploading ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </FormGroup>
            </Box>
        </Dialog>
    );
}