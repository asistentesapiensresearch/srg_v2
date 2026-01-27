import { useEffect, useState } from "react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { remove, getUrl } from "aws-amplify/storage";
import {
    Button,
    Dialog,
    DialogTitle,
    TextField,
    InputLabel,
    FormGroup, // Importado
    FormControl, // Importado
    FormHelperText, // Importado
} from "@mui/material";
import { moveIconToDefinitiveFolder } from "../../helpers/moveIconToDefinitiveFolder";
import { Preloader } from "@src/components/preloader";

export function BrandForm({ onClose, brand, store }) {

    const [name, setName] = useState(brand?.name || "");
    const [link, setLink] = useState(brand?.link || "");
    const [iconKey, setIconKey] = useState(brand?.icon || "");
    const [iconPreview, setIconPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [tempKeys, setTempKeys] = useState([]);

    // 1. Estado para manejar los errores de validación
    const [errors, setErrors] = useState({});

    const TEMP_FOLDER = "brands/temp/";

    useEffect(() => {
        if (brand) {
            setName(brand.name);
            setLink(brand.link);
            if (brand.key) {
                setIconKey(brand.key); // Aseguramos que iconKey tenga el valor existente
                getUrl({ path: brand.key }).then((res) => {
                    setIconPreview(res.url.toString());
                });
            }
        }
    }, [brand]);

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
        try {
            setUploading(true);
            const finalKey = await moveIconToDefinitiveFolder(TEMP_FOLDER, iconKey, name);
            // Si estamos editando y el ícono cambió (y no es el temporal), borramos el anterior
            if (brand?.id && brand.key && brand.key !== finalKey) {
                await remove({ path: brand.key });
            }
            setIconKey(finalKey);
            const { brand: brandDB, errors } = await store({
                iconKey: finalKey,
                name,
                link,
                brand
            })
            if (errors) {
                setErrors(errors)
            } else if (brandDB) {
                onClose(brandDB);
            }
        } catch (error) {
            console.error("Error saving brand:", error);
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
            <DialogTitle>{brand?.id ? "Editar sección" : "Crear nueva sección"}</DialogTitle>

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
                            <div className="max-w-20">
                                <img
                                    src={iconPreview}
                                    alt="Icono actual"
                                    className="w-100 object-cover rounded border"
                                />
                            </div>
                            <small className="text-gray-500">Puedes subir uno nuevo para reemplazarlo</small>
                        </div>
                    )}
                    <FileUploader
                        acceptedFileTypes={["image/*"]}
                        path={TEMP_FOLDER}
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
                        startIcon={uploading && <Preloader />}
                    >
                        Guardar
                    </Button>
                </div>
            </FormGroup>
        </Dialog>
    );
}