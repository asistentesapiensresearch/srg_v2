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

const tempFolder = "research/temp/";

export function ResearchForm({ research, onClose, store }) {

    const { sections } = useSections();
    const rteRefDesc = useRef(null);
    const rteRefShortDesc = useRef(null);
    const rteRefAlert = useRef(null);
    const acceptedFileTypes = useMemo(() => ["image/*"], []);

    // -------------- ESTADO ÚNICO -----------------
    const [form, setForm] = useState({
        title: "",
        path: "",
        shortDescription: "",
        description: "",
        alert: "",
        dateRange: "",
        logos: [],
        sectionId: "",
        icon: "",
        update: false
    });

    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [initialForm, setInitialForm] = useState(null);

    // -------------- CARGA INICIAL -----------------
    useEffect(() => {
        const initResearch = async () => {
            const initialData = {
                title: research?.title || "",
                path: research?.path || "",
                shortDescription: research?.shortDescription || "",
                description: research?.description || "",
                alert: research?.alert || "",
                dateRange: research?.dateRange || "",
                logos: research?.logos || [],
                sectionId: research?.sectionId || "",
                icon: research?.icon || ""
            };
            console.log('initialData', initialData)

            setForm(initialData);
            setInitialForm(initialData); // Guardar estado inicial
            setIconPreview(research?.icon || "");
            setIsInitialized(true);
        };
        initResearch();
    }, [research]);

    // -------------- DETECTAR CAMBIOS -----------------
    useEffect(() => {
        if (!isInitialized || !initialForm) return;

        // Comparar estado actual con inicial
        const formChanged = Object.keys(form).some(key => {
            if (key === 'logos') {
                return JSON.stringify(form[key]) !== JSON.stringify(initialForm[key]);
            }
            return form[key] !== initialForm[key];
        });

        // También verificar cambios en los editores
        const shortDescChanged = rteRefShortDesc.current?.editor?.getHTML() !== initialForm.shortDescription;
        const descChanged = rteRefDesc.current?.editor?.getHTML() !== initialForm.description;
        const alertChanged = rteRefAlert.current?.editor?.getHTML() !== initialForm.alert;

        const updated = form.update && (
            shortDescChanged !== research?.shortDescription
            || descChanged !== research?.description
            || alertChanged !== research?.alert
        )

        setHasChanges(formChanged || shortDescChanged || descChanged || alertChanged || updated);
    }, [form, isInitialized, initialForm]);

    // -------------- HANDLERS -----------------
    const handleChange = useCallback((field) => (e) => {
        const value = field === 'logos' ? e.map(item => item.id) : e.target?.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleIconChange = useCallback((value) => {
        setForm(prev => ({ ...prev, icon: value }));
    }, []);

    // Genera el path automáticamente desde el título
    const generatePath = useCallback((title) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    }, []);

    const handleTitleChange = useCallback((e) => {
        const newTitle = e.target.value;
        setForm((prev) => ({
            ...prev,
            title: newTitle,
            path: generatePath(newTitle)
        }));
    }, [generatePath]);

    // -------------- VALIDACIÓN -----------------
    const validateForm = useCallback(() => {
        const newErrors = {};

        const shortDescription = rteRefShortDesc.current?.editor?.getHTML();
        const description = rteRefDesc.current?.editor?.getHTML();
        const alert = rteRefAlert.current?.editor?.getHTML();

        if (!form.title.trim()) newErrors.title = "El título es obligatorio.";
        if (!form.path.trim()) {
            newErrors.path = "El path es obligatorio.";
        } else if (!/^[a-z0-9-]+$/.test(form.path)) {
            newErrors.path = "El path solo puede contener letras minúsculas, números y guiones.";
        }
        if (!shortDescription?.trim() || shortDescription === '<p></p>') {
            newErrors.shortDescription = "La descripción corta es obligatoria.";
        }
        if (!description?.trim() || description === '<p></p>') {
            newErrors.description = "La descripción es obligatoria.";
        }
        if (!alert?.trim() || alert === '<p></p>') {
            newErrors.alert = "La alerta es obligatoria.";
        }
        if (!form.dateRange.trim()) newErrors.dateRange = "El rango de fechas es obligatorio.";
        if (!form.sectionId) newErrors.sectionId = "Debe seleccionar una sección.";
        if (!form.icon) newErrors.icon = "Debe subir un ícono.";

        setErrors(newErrors);

        // Actualizar el estado con los valores de los editores
        if (Object.keys(newErrors).length === 0) {
            setForm((prev) => ({
                ...prev,
                shortDescription,
                description,
                alert
            }));
        }

        return Object.keys(newErrors).length === 0;
    }, [form]);

    // -------------- VALIDACIÓN EN TIEMPO REAL -----------------
    const isFormValid = useMemo(() => {
        const shortDescription = rteRefShortDesc.current?.editor?.getHTML();
        const description = rteRefDesc.current?.editor?.getHTML();
        const alert = rteRefAlert.current?.editor?.getHTML();

        return (
            form.title.trim() !== "" &&
            form.path.trim() !== "" &&
            /^[a-z0-9-]+$/.test(form.path) &&
            shortDescription && shortDescription !== '<p></p>' &&
            description && description !== '<p></p>' &&
            alert && alert !== '<p></p>' &&
            form.dateRange.trim() !== "" &&
            form.sectionId !== "" &&
            form.icon !== ""
        );
    }, [form]);

    // -------------- SAVE -----------------
    const handleSave = useCallback(async () => {
        if (!validateForm()) return;

        try {
            setUploading(true);
            let finalKey = form.icon;

            if (form.icon.startsWith(tempFolder)) {
                const newKey = form.icon.replace("temp/", `${form.path}/`);
                await copy({ source: { path: form.icon }, destination: { path: newKey } });
                await remove({ path: form.icon });
                finalKey = newKey;
                setForm({ ...form, icon: finalKey })
            }

            const researchData = {
                ...form,
                icon: finalKey,
                version: (research?.version || 0) + 1
            };

            delete researchData.update;

            const researchDB = await store(researchData, research?.id);
            onClose(researchDB);

        } catch (error) {
            console.error("Error saving research:", error);
            alert(`Error al guardar: ${error.message || error}`);
        } finally {
            setUploading(false);
        }
    }, [form, validateForm, research, store, onClose]);

    // -------------- MEMO DE LAS OPCIONES -----------------
    const sectionOptions = useMemo(
        () => sections.map((s) => ({ label: s.name, id: s.id })),
        [sections]
    );

    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("ResearchForm", {
            research,
            sections,
            onClose,
            form
        });
    }

    if (!isInitialized) {
        return (
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
                <Box className="flex justify-center items-center p-8">
                    <CircularProgress />
                </Box>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{research?.id ? "Editar" : "Crear nueva"} investigación</DialogTitle>
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
                        helperText={errors.path || "Se genera automáticamente desde el título. Solo minúsculas, números y guiones."}
                        placeholder="ejemplo-de-path"
                    />

                    {/* ÍCONO */}
                    <div>
                        <span className="text-sm font-medium text-gray-700">Logo</span>
                        <UploadInputForm
                            tempFolder={tempFolder}
                            iconPreview={iconPreview}
                            setIconPreview={setIconPreview}
                            acceptedFileTypes={acceptedFileTypes}
                            handleChange={handleIconChange}
                            setUploading={setUploading}
                            error={errors.icon}
                        />
                    </div>

                    {/* DESCRIPCIÓN CORTA */}
                    <div className={`${errors.shortDescription && "border border-red-700 rounded-lg"}`}>
                        <RichTextEditorInpt
                            placeholder="Descripción corta"
                            rteRef={rteRefShortDesc}
                            content={form.shortDescription}
                            onChange={validateForm}
                        />
                        {errors.shortDescription && <FormHelperText error>{errors.shortDescription}</FormHelperText>}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className={`${errors.description && "border border-red-700 rounded-lg"}`}>
                        <RichTextEditorInpt
                            placeholder="Descripción"
                            rteRef={rteRefDesc}
                            content={form.description}
                            onChange={validateForm}
                        />
                        {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                    </div>

                    {/* ALERTA */}
                    <div className={`${errors.alert && "border border-red-700 rounded-lg"}`}>
                        <RichTextEditorInpt
                            placeholder="Mensaje importante"
                            rteRef={rteRefAlert}
                            content={form.alert}
                            onChange={validateForm}
                        />
                        {errors.alert && <FormHelperText error>{errors.alert}</FormHelperText>}
                    </div>

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
                                sx={{ width: '100%' }}
                                value={sectionOptions.find((s) => s.id === form.sectionId) || null}
                                onChange={(e, v) => setForm((prev) => ({ ...prev, sectionId: v?.id || "" }))}
                                renderInput={(params) => <TextField {...params} label="Sección" />}
                            />
                            {errors.sectionId && <FormHelperText error>{errors.sectionId}</FormHelperText>}
                        </div>
                    </div>

                    <LogoComponent
                        onChange={handleChange("logos")}
                    />

                    {/* BOTONES */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outlined" color="error" onClick={onClose}>
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