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

export function LogoForm({ onClose, logo, open }) {

    const [name, setName] = useState(logo?.name || "");
    const [link, setLink] = useState(logo?.link || "");
    const [iconKey, setIconKey] = useState(logo?.icon || "");
    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [tempKeys, setTempKeys] = useState([]);

    // 1. Estado para manejar los errores de validación
    const [errors, setErrors] = useState({});

    const tempFolder = "logos/temp/";

    useEffect(() => {
        if (logo) {
            setName(logo.name);
            setLink(logo.link);
            if (logo.key) {
                setIconKey(logo.key); // Aseguramos que iconKey tenga el valor existente
                getUrl({ path: logo.key }).then((res) => {
                    setIconPreview(res.url.toString());
                });
            }
        }
    }, [logo]);

    // 2. Función de validación
    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "El nombre es obligatorio.";
        }
        if (!link.trim()) {
            newErrors.link = "El link es obligatorio.";
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
        if (!validateForm()) {
            return; // Detiene la ejecución si el formulario no es válido
        }

        try {
            setUploading(true);
            let finalKey = iconKey;

            // Mover icono a carpeta definitiva
            if (iconKey.startsWith(tempFolder)) {
                const sanitized = name.toLowerCase().replace(/\s+/g, "_");
                const newKey = iconKey.replace("temp/", `${sanitized}/`);
                await copy({
                    source: { path: iconKey },
                    destination: { path: newKey }
                });
                await remove({ path: iconKey });
                finalKey = newKey;
            }

            // Si estamos editando y el ícono cambió (y no es el temporal), borramos el anterior
            if (logo?.id && logo.key && logo.key !== finalKey) {
                await remove({ path: logo.key });
            }

            // Guardar en tu backend o DataStore
            const newData = {
                name,
                link,
                key: finalKey,
            };
            if (logo?.id) {
                const logoDB = await apiSyncService.update('Logo', logo.id,newData)
                onClose(logoDB);
            } else {
                const newLogo = await apiSyncService.create('Logo',newData);
                onClose(newLogo);
            }
        } catch (error) {
            console.error("Error saving logo:", error);
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
            <DialogTitle>{logo?.id ? "Editar sección" : "Crear nueva sección"}</DialogTitle>

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

                {/* Link */}
                <TextField
                    label="Link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    fullWidth
                    required
                    error={!!errors.link}
                    helperText={errors.link}
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