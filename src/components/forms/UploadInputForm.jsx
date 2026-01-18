import { FileUploader, StorageImage } from "@aws-amplify/ui-react-storage";
import { FormHelperText, InputLabel } from "@mui/material";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";
import { getUrl } from "aws-amplify/storage";
import React, { useCallback, useMemo } from "react";

const UploadInputForm = ({
    acceptedFileTypes = ["image/*"],
    tempFolder = "temp/",
    maxFileCount = 1,
    iconPreview,
    setIconPreview,
    setUploading,
    handleChange,
    error,
    setErrors, // si lo usas realmente, asegúrate de pasarlo
}) => {
    if (import.meta.env.MODE === "development") {
        useWhyDidYouUpdate("UploadInputForm", {
            acceptedFileTypes,
            tempFolder,
            maxFileCount,
            iconPreview,
            setIconPreview,
            setUploading,
            handleChange,
            error,
            setErrors,
        });
    }

    const handleUploadStart = useCallback(() => {
        setUploading(true);
    }, [setUploading]);

    const handleUploadError = useCallback(
        (err) => {
            console.error("Error uploading:", err);
            setUploading(false);

            if (setErrors) {
                setErrors((prev) => ({ ...prev, icon: "Error al subir el archivo." }));
            }
        },
        [setUploading, setErrors]
    );

    const handleUploadSuccess = useCallback(
        async ({ key }) => {
            handleChange(key);
            console.log(key)

            try {
                setIconPreview(key);
            } catch (err) {
                console.error("Error obteniendo URL:", err);
            }

            setUploading(false);

            if (error && setErrors) {
                setErrors((prev) => ({ ...prev, icon: null }));
            }
        },
        [handleChange, setIconPreview, setUploading, error, setErrors]
    );

    // Memo para evitar recreación de processFile
    const processFile = useCallback(
        ({ file }) => ({
            file,
            key: `${Date.now()}-${file.name}`,
        }),
        []
    );

    const showThumbnails = useMemo(() => !iconPreview, [iconPreview]);

    return (
        <div>
            {iconPreview && (
                <div className="flex flex-col items-start mb-4">
                    <InputLabel style={{ position: "relative", transform: "none" }}>
                        Ícono actual
                    </InputLabel>

                    <div className="flex justify-center w-20 h-20 bg-gray-300 p-3">
                        <StorageImage alt="sleepy-cat" path={iconPreview} className="h-[100%!important]" />
                    </div>

                    <small className="text-gray-500">
                        Puedes subir uno nuevo para reemplazarlo
                    </small>
                </div>
            )}

            <FileUploader
                acceptedFileTypes={acceptedFileTypes}
                path={tempFolder}
                maxFileCount={maxFileCount}
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                showThumbnails={showThumbnails}
                variation="drop"
                processFile={processFile}
            />

            {error && <FormHelperText error>{error}</FormHelperText>}
        </div>
    );
};

UploadInputForm.whyDidYouRender = true;
export default React.memo(UploadInputForm);
