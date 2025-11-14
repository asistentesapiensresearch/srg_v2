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

    const tempFolder = "sections/temp/";

    useEffect(() => {
        if (section) {
            setName(section.name);
            setDescription(section.description);
            setColor(section.color);
            if (section.icon) {
                getUrl({ path: section.icon }).then((res) => {
                    setIconPreview(res.url.toString());
                });
            }
        }
    }, [section]);

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
    };

    const handleSave = async () => {
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

            console.log('finalKey', finalKey, section)

            // Guardar en tu backend o DataStore
            if (section.id) {
                if(section.icon){
                    await remove({ path: section.icon });
                }
                const sectionDB = await apiSyncService.update('Section', section.id, {
                    name,
                    description,
                    color,
                    icon: finalKey,
                })
                console.log(sectionDB)
                onClose(sectionDB);
            } else {
                const section = await apiSyncService.create('Section', {
                    name,
                    description,
                    color,
                    icon: finalKey,
                });
                onClose(section);
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
            <DialogTitle>{section ? "Editar sección" : "Crear nueva sección"}</DialogTitle>

            <div className="p-4 flex flex-col gap-4">
                {/* Nombre */}
                <TextField
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />

                {/* Descripción */}
                <TextField
                    label="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                />

                {/* Selector de color */}
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <InputLabel>Color de la sección</InputLabel>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-16 h-10 cursor-pointer rounded border border-gray-300"
                        />
                    </div>

                    <div
                        className="flex items-center justify-center rounded-md w-16 h-10 border text-sm"
                        style={{ backgroundColor: color, color: "#fff" }}
                    >
                        {color.toUpperCase()}
                    </div>
                </div>

                {/* Uploader de icono */}
                {iconPreview && (
                    <div className="flex flex-col items-start gap-2">
                        <InputLabel>Ícono actual</InputLabel>
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
            </div>
        </Dialog>
    );
}