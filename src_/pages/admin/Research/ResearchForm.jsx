import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { remove, copy, getUrl } from "aws-amplify/storage";
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
    Fab,
} from "@mui/material";
import RichTextEditorInpt from "@src/components/forms/RichTextEditor";
import LogoComponent from "@src/components/forms/LogoComponent";
import UploadInputForm from "@src/components/forms/UploadInputForm";
import { DriveIcon } from "@src/components/icons";
import { useDrivePicker } from "@src/hooks/useDrivePicker";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";
import { apiSyncService } from "@core/infrastructure/api/apiSync.service";
import { useSections } from "@src/hooks/useSections";

const tempFolder = "research/temp/";

export function ResearchForm({ research, onClose }) {

    const { sections } = useSections();
    const [dataSource, setDataSource] = useState(null);
    const rteRefDesc = useRef(null);
    const rteRefShortDesc = useRef(null);
    const rteRefAlert = useRef(null);
    const acceptedFileTypes = useMemo(() => ["image/*"], []);

    const { openPicker } = useDrivePicker();

    async function connectDrive() {
        const file = await openPicker();
        setDataSource(file);
    }

    // -------------- OPTIMIZACIÓN: ESTADO ÚNICO -----------------
    const [form, setForm] = useState({
        title: "",
        shortDescription: "",
        description: "",
        alert: "",
        dateRange: "",
        logos: [],            // <--- AQUÍ
        sectionId: "",
        icon: ""
    });

    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    // -------------- CARGA INICIAL -----------------
    useEffect(() => {
        const initResearch = async () => {
            const { data: logos } = await research.logos();
            console.log('logos',logos)
            setForm({
                ...research
            });
            setIconPreview(research.icon)
        }
        if (research) initResearch();
    }, [research]);

    // -------------- HANDLER GENÉRICO -----------------
    const handleChange = useCallback((field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: field == 'logos' ? e.map(e => e.id) : e.target?.value }));
    }, []);

    const handleIconChange = useCallback((value) => {
        console.log(value);
        setForm(prev => ({ ...prev, icon: value }))
    }, []);

    // -------------- VALIDACIÓN -----------------
    const validateForm = useCallback(() => {
        const newErrors = {};

        const shortDescription = rteRefShortDesc.current?.editor?.getHTML();
        const description = rteRefDesc.current?.editor?.getHTML();
        const alert = rteRefAlert.current?.editor?.getHTML();

        setForm((prev) => ({
            ...prev,
            shortDescription,
            description,
            alert
        }));

        if (!form.title.trim()) newErrors.title = "El título es obligatorio.";
        if (!shortDescription.trim()) newErrors.shortDescription = "La descripción corta es obligatoria.";
        if (!description.trim()) newErrors.description = "La descripción es obligatoria.";
        if (!alert.trim()) newErrors.alert = "La alerta es obligatoria.";
        if (!form.dateRange.trim()) newErrors.dateRange = "El rango de fechas es obligatorio.";
        if (!dataSource) newErrors.dataSource = "El drive de la fuente de datos es obligatorio.";
        if (!form.sectionId) newErrors.sectionId = "Debe seleccionar una sección.";
        if (!form.icon) newErrors.icon = "Debe subir un ícono.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    // -------------- SAVE -----------------
    const handleSave = useCallback(async () => {
        if (!validateForm()) return;

        try {
            setUploading(true);
            let finalKey = form.icon;

            if (form.icon.startsWith(tempFolder)) {
                const sanitized = form.title.toLowerCase().replace(/\s+/g, "_");
                const newKey = form.icon.replace("temp/", `${sanitized}/`);
                await copy({ source: { path: form.icon }, destination: { path: newKey } });
                await remove({ path: form.icon });
                finalKey = newKey;
                handleIconChange(finalKey);
            }

            const researchData = {
                ...form,
                dataSource,
                icon: finalKey,
                version: (research?.version || 0) + 1
            };

            // Guardar en tu backend o DataStore
            if (research?.id) {
                const researchDB = await apiSyncService.update('Research', research.id, researchData)
                onClose(researchDB);
            } else {
                const newResearch = await apiSyncService.create('Research', researchData);
                onClose(newResearch);
            }

        } catch (error) {
            console.error("Error saving research:", error);
            alert(`Error al guardar: ${error.message || error}`);
        } finally {
            setUploading(false);
        }
    }, [form, validateForm]);

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

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{research?.id ? "Editar" : "Crear nueva"} investigación</DialogTitle>
            <Box className="px-4 pb-4 bg-white rounded-lg shadow-md">
                <FormGroup className="flex flex-col gap-6">

                    {/* TÍTULO */}
                    <TextField
                        label="Título"
                        value={form.title}
                        onChange={handleChange("title")}
                        fullWidth
                        required
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    {/* DESCRIPCIÓN CORTA */}
                    <div className={`${errors.shortDescription && "border border-red-700 rounded-lg"}`}>
                        <RichTextEditorInpt placeholder="Descripción corta" rteRef={rteRefShortDesc} content={form.shortDescription} />
                        {errors.shortDescription && <FormHelperText error>{errors.shortDescription}</FormHelperText>}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className={`${errors.description && "border border-red-700 rounded-lg"}`}>
                        <RichTextEditorInpt placeholder="Descripción" rteRef={rteRefDesc} />
                        {errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
                    </div>

                    {/* ALERTA */}
                    <div className={`${errors.alert && "border border-red-700 rounded-lg"}`}>
                        <RichTextEditorInpt placeholder="Mensaje importante" rteRef={rteRefAlert} />
                        {errors.alert && <FormHelperText error>{errors.alert}</FormHelperText>}
                    </div>

                    {/* RANGO DE FECHAS */}
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
                            <div className="flex gap-2 items-center">
                                <Fab variant="extended" className="flex items-center" onClick={connectDrive}>
                                    <DriveIcon className="w-6" />
                                    <span className="ms-2">Drive</span>
                                </Fab>
                                {dataSource && <span className="font-medium">{dataSource.name}</span>}
                            </div>
                            {errors.dataSource && <div>
                                <FormHelperText error>{errors.dataSource}</FormHelperText>
                            </div>}
                        </div>
                    </div>

                    <LogoComponent
                        onChange={handleChange("logos")}
                    />

                    {/* SECCIÓN */}
                    <Autocomplete
                        disablePortal
                        options={sectionOptions}
                        sx={{ width: 300 }}
                        value={sectionOptions.find((s) => s.id === form.sectionId) || null}
                        onChange={(e, v) => setForm((prev) => ({ ...prev, sectionId: v?.id || "" }))}
                        renderInput={(params) => <TextField {...params} label="Secciones" />}
                    />
                    {errors.sectionId && <FormHelperText error>{errors.sectionId}</FormHelperText>}

                    {/* ÍCONO */}
                    <UploadInputForm
                        tempFolder="research/temp/"
                        iconPreview={iconPreview}
                        setIconPreview={setIconPreview}
                        acceptedFileTypes={acceptedFileTypes}
                        handleChange={handleIconChange}
                        setUploading={setUploading}
                        error={errors.icon}
                    />

                    {/* BOTONES */}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outlined" color="error" onClick={onClose}>Cancelar</Button>

                        <Button
                            variant="contained"
                            disabled={uploading}
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