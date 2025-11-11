import { useState } from "react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { getUrl } from "aws-amplify/storage";
import { Alert, CircularProgress } from "@mui/material";

export const SecureFileUploader = ({
    folder = "shared",
    onUploadComplete,
    maxFileSizeMB = 5,
}: {
    folder?: string;
    onUploadComplete?: (url: string, key: string) => void;
    maxFileSizeMB?: number;
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const validateFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Solo se permiten imágenes.");
            return false;
        }
        if (file.size > maxFileSizeMB * 1024 * 1024) {
            setError(`El archivo no debe superar ${maxFileSizeMB} MB.`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleUploadStart = () => {
        setUploading(true);
        setError(null);
    };

    const handleUploadSuccess = async (event: { key: string }) => {
        try {
            setUploading(false);
            const { url } = await getUrl({ path: event.key });
            const secureUrl = url.toString();
            setPreviewUrl(secureUrl);
            onUploadComplete?.(secureUrl, event.key);
        } catch {
            setError("Error obteniendo la URL segura.");
        }
    };

    const handleUploadError = (err: unknown) => {
        console.error("Error al subir:", err);
        setError("Error al subir el archivo. Intenta nuevamente.");
        setUploading(false);
    };

    const processFile = ({ file, key }: { file: File; key: string }) => {
        if (!validateFile(file)) throw new Error("Archivo inválido");
        const newKey = `${folder}/${file.name}`;
        return { file, key: newKey };
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <FileUploader
                acceptedFileTypes={["image/*"]}
                maxFileCount={1}
                path={folder}
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                processFile={processFile}
                showThumbnails
            />

            {uploading && (
                <div className="flex items-center gap-2 text-gray-600">
                    <CircularProgress size={20} />
                    <span>Subiendo imagen...</span>
                </div>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {previewUrl && (
                <div className="flex justify-center mt-2">
                    <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="w-40 h-40 rounded-lg shadow-md object-cover border"
                    />
                </div>
            )}
        </div>
    );
};