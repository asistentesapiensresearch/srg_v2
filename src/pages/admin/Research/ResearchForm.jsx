import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { remove, copy } from "aws-amplify/storage";
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
import LogoComponent from "@src/components/forms/LogoComponent";
import UploadInputForm from "@src/components/forms/UploadInputForm";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";
import { useSections } from "@src/pages/admin/Sections/hooks/useSections";

const TEMP_FOLDER = "research/temp/";
const ACCEPTED_FILE_TYPES = ["image/*"];
const CATEGORIES = ['Ranking General', 'Indicadores Específicos', 'Mejores Grupos'];
const SUB_CATEGORIES = ['Universidades', 'Colegios', 'Organizaciones'];

const INITIAL_FORM_STATE = {
    title: "",
    path: "",
    description: "",
    dateRange: "",
    logos: [],
    sectionId: "",
    category: "",
    subCategory: "",
    icon: "",
};

export function ResearchForm({ research, onClose, store }) {
    const { sections } = useSections();
    const rteRefDesc = useRef(null);

    const [form, setForm] = useState(INITIAL_FORM_STATE);
    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [initialForm, setInitialForm] = useState(null);

    // -------------- UTILITIES -----------------
    const generatePath = useCallback((title) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }, []);

    const getCurrentDescription = useCallback(() => {
        return rteRefDesc.current?.editor?.getHTML() || "";
    }, []);

    // -------------- INITIAL LOAD -----------------
    useEffect(() => {
        const initialData = {
            title: research?.title || "",
            path: research?.path || "",
            description: research?.description || "",
            dateRange: research?.dateRange || "",
            logos: research?.logos || [],
            sectionId: research?.sectionId || "",
            category: research?.category || "",
            subCategory: research?.subCategory || "",
            icon: research?.icon || "",
        };

        setForm(initialData);
        setInitialForm(initialData);
        setIconPreview(research?.icon || "");
        setIsInitialized(true);
    }, [research]);

    // -------------- CHANGE DETECTION -----------------
    const hasChanges = useMemo(() => {
        if (!isInitialized || !initialForm) return false;

        const formChanged = Object.keys(form).some(key => {
            if (key === 'logos') {
                return JSON.stringify(form[key]) !== JSON.stringify(initialForm[key]);
            }
            return form[key] !== initialForm[key];
        });

        const currentDesc = getCurrentDescription();
        const descChanged = currentDesc !== initialForm.description;

        return formChanged || descChanged;
    }, [form, isInitialized, initialForm, getCurrentDescription]);

    // -------------- HANDLERS -----------------
    const handleChange = useCallback((field) => (e) => {
        const value = field === 'logos' ? e.map(item => item.id) : e.target?.value;
        setForm(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleIconChange = useCallback((value) => {
        setForm(prev => ({ ...prev, icon: value }));
    }, []);

    const handleTitleChange = useCallback((e) => {
        const newTitle = e.target.value;
        setForm(prev => ({
            ...prev,
            title: newTitle,
            path: generatePath(newTitle)
        }));
    }, [generatePath]);

    const handleAutocompleteChange = useCallback((field) => (_, value) => {
        setForm(prev => ({ ...prev, [field]: value?.id || value || "" }));
    }, []);

    // -------------- VALIDATION -----------------
    const validateForm = useCallback(() => {
        const newErrors = {};
        const description = getCurrentDescription();

        if (!form.title.trim()) {
            newErrors.title = "El título es obligatorio.";
        }

        if (!form.path.trim()) {
            newErrors.path = "El path es obligatorio.";
        } else if (!/^[a-z0-9-]+$/.test(form.path)) {
            newErrors.path = "El path solo puede contener letras minúsculas, números y guiones.";
        }

        if (!description?.trim() || description === '<p></p>') {
            newErrors.description = "La descripción es obligatoria.";
        }

        if (!form.dateRange.trim()) {
            newErrors.dateRange = "El rango de fechas es obligatorio.";
        }

        if (!form.sectionId) {
            newErrors.sectionId = "Debe seleccionar una sección.";
        }

        if (!form.category) {
            newErrors.category = "Debe seleccionar una categoría.";
        }

        if (!form.subCategory) {
            newErrors.subCategory = "Debe seleccionar una subcategoría.";
        }

        if (!form.icon) {
            newErrors.icon = "Debe subir un ícono.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form, getCurrentDescription]);

    const isFormValid = useMemo(() => {
        const description = getCurrentDescription();

        return Boolean(
            form.title.trim() &&
            form.path.trim() &&
            /^[a-z0-9-]+$/.test(form.path) &&
            description && description !== '<p></p>' &&
            form.dateRange.trim() &&
            form.sectionId &&
            form.category &&
            form.subCategory &&
            form.icon
        );
    }, [form, getCurrentDescription]);

    // -------------- SAVE -----------------
    const handleSave = useCallback(async () => {
        if (!validateForm()) return;

        try {
            setUploading(true);
            let finalKey = form.icon;

            // Move icon from temp to final location if needed
            if (form.icon.startsWith(TEMP_FOLDER)) {
                const newKey = form.icon.replace("temp/", `${form.path}/`);
                await copy({
                    source: { path: form.icon },
                    destination: { path: newKey }
                });
                await remove({ path: form.icon });
                finalKey = newKey;
            }

            const researchData = {
                ...form,
                description: getCurrentDescription(),
                icon: finalKey,
                version: (research?.version || 0) + 1
            };

            const { errors: saveErrors, research: researchDB } = await store(researchData, research?.id);

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

    // -------------- MEMOIZED OPTIONS -----------------
    const sectionOptions = useMemo(
        () => sections.map(s => ({ label: s.name, id: s.id })),
        [sections]
    );

    const selectedSection = useMemo(
        () => sectionOptions.find(s => s.id === form.sectionId) || null,
        [sectionOptions, form.sectionId]
    );

    // -------------- DEBUG -----------------
    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("ResearchForm", {
            research,
            sections,
            onClose,
            form
        });
    }

    // -------------- LOADING STATE -----------------
    if (!isInitialized) {
        return (
            <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
                <Box className="flex justify-center items-center p-8">
                    <CircularProgress />
                </Box>
            </Dialog>
        );
    }

    // -------------- RENDER -----------------
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
                        onChange={handleChange("path")}
                        fullWidth
                        required
                        error={!!errors.path}
                        helperText={
                            errors.path ||
                            "Se genera automáticamente desde el título. Solo minúsculas, números y guiones."
                        }
                        placeholder="ejemplo-de-path"
                    />

                    {/* RANGO DE FECHAS Y SECCIÓN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField
                            label="Rango de Fechas"
                            value={form.dateRange}
                            onChange={handleChange("dateRange")}
                            fullWidth
                            required
                            error={!!errors.dateRange}
                            helperText={errors.dateRange}
                        />

                        <div>
                            <Autocomplete
                                disablePortal
                                options={sectionOptions}
                                value={selectedSection}
                                onChange={handleAutocompleteChange("sectionId")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Sección"
                                        required
                                        error={!!errors.sectionId}
                                    />
                                )}
                                fullWidth
                            />
                            {errors.sectionId && (
                                <FormHelperText error>{errors.sectionId}</FormHelperText>
                            )}
                        </div>
                    </div>

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

                    {/* LOGOS */}
                    <LogoComponent onChange={handleChange("logos")} />

                    {/* ERROR GENERAL */}
                    {errors.submit && (
                        <FormHelperText error>{errors.submit}</FormHelperText>
                    )}

                    {/* BOTONES */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={onClose}
                            disabled={uploading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            disabled={uploading || !isFormValid || !hasChanges}
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