import { useEffect, useState } from "react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { remove, copy, getUrl } from "aws-amplify/storage";
import {
    Button,
    Dialog,
    DialogTitle,
    TextField,
    CircularProgress,
    InputLabel,
    FormGroup, // Importado
    FormControl, // Importado
    FormHelperText, // Importado
} from "@mui/material";
import { apiSyncService } from '@core/infrastructure/api/apiSync.service'

export function SectionForm({ onClose, section, open }) {

    const [name, setName] = useState(section?.name || "");
    const [description, setDescription] = useState(section?.description || "");
    const [color, setColor] = useState(section?.color || "#CF4040");
    const [iconKey, setIconKey] = useState(section?.icon || "");
    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [tempKeys, setTempKeys] = useState([]);

    // 1. Estado para manejar los errores de validación
    const [errors, setErrors] = useState({});

    const tempFolder = "sections/temp/";

    useEffect(() => {
        if (section) {
            setName(section.name);
            setDescription(section.description);
            setColor(section.color);
            if (section.icon) {
                setIconKey(section.icon); // Aseguramos que iconKey tenga el valor existente
                getUrl({ path: section.icon }).then((res) => {
                    setIconPreview(res.url.toString());
                });
            }
        }
    }, [section]);

    // 2. Función de validación
    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "El nombre es obligatorio.";
        }
        if (!description.trim()) {
            newErrors.description = "La descripción es obligatoria.";
        }
        // Validamos que haya un ícono (ya sea uno existente o uno nuevo)
        if (!iconKey) {
            newErrors.icon = "Debe subir un ícono.";
        }

        setErrors(newErrors);
        // Retorna true si no hay errores
        return Object.keys(newErrors).length === 0;
    };

    const handleUploadStart = () => setUploading(true);
    const handleUploadError = (err) => {
        console.error("Error uploading:", err);
        setUploading(false);
    };

    const handleUploadSuccess = async ({ key }) => {
        setIconKey(key);
        setTempKeys((prev) => [...prev, key]);
        const result = await getUrl({ path: key });
        setIconPreview(result.url.toString());
        setUploading(false);
        // Limpiar el error de ícono si existía
        if (errors.icon) {
            setErrors(prev => ({ ...prev, icon: null }));
        }
    };

    const handleSave = async () => {
        // 3. Validar antes de guardar
        if (!validateForm()) return;

        try {
            setUploading(true);
            const logoDB = await saveLogo({
                iconKey,
                tempFolder,
                name,
                link,
                logo
            })
            onClose(logoDB);
        } catch (error) {
            console.error("Error saving logo:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        // 3. Validar antes de guardar
        if (!validateForm()) {
            return; // Detiene la ejecución si el formulario no es válido
        }

        try {
            setUploading(true);
            let finalKey = iconKey;

            

            // Guardar en tu backend o DataStore
            if (section?.id) {
                const sectionDB = await apiSyncService.update('Section', section.id, {
                    name,
                    description,
                    color,
                    icon: finalKey,
                })
                onClose(sectionDB);
            } else {
                const newSection = await apiSyncService.create('Section', {
                    name,
                    description,
                    color,
                    icon: finalKey,
                });
                onClose(newSection);
            }
        } catch (error) {
            console.error("Error saving section:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = async () => {
        for (const key of tempKeys) {
            await remove({ path: key });
        }
        onClose(null);
    };

    return (
        <Dialog open={true} onClose={handleCancel} maxWidth="sm" fullWidth>
            <DialogTitle>{section?.id ? "Editar sección" : "Crear nueva sección"}</DialogTitle>

            {/* 4. FormGroup agrupa los controles del formulario */}
            <FormGroup className="p-4 flex flex-col gap-4">
                {/* Nombre */}
                <TextField
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name}
                />

                {/* Descripción */}
                <TextField
                    label="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    required
                    error={!!errors.description}
                    helperText={errors.description}
                />

                {/* Selector de color (Reemplazado por TextField tipo color para mejor integración con MUI) */}
                <TextField
                    label="Color de la sección"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }} // Mantiene la etiqueta arriba
                    className="max-w-[200px]" // Limita el ancho
                />

                {/* 5. FormControl para el Uploader de icono */}
                <FormControl error={!!errors.icon} fullWidth>
                    {iconPreview && (
                        <div className="flex flex-col items-start mb-4">
                            <InputLabel style={{
                                position: 'relative',
                                transform: 'none'
                            }}>Ícono actual</InputLabel>
                            <img
                                src={iconPreview}
                                alt="Icono actual"
                                className="w-20 h-20 object-cover rounded border mix-blend-difference"
                            />
                            <small className="text-gray-500">Puedes subir uno nuevo para reemplazarlo</small>
                        </div>
                    )}
                    <FileUploader
                        acceptedFileTypes={["image/*"]}
                        path={tempFolder}
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
                    {/* Muestra el error específico del FileUploader */}
                    {errors.icon && <FormHelperText error>{errors.icon}</FormHelperText>}
                </FormControl>

                {/* Botones */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outlined" color="error" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        disabled={uploading}
                        onClick={handleSave}
                        startIcon={uploading && <CircularProgress size={16} />}
                    >
                        Guardar
                    </Button>
                </div>
            </FormGroup>
        </Dialog>
    );
}