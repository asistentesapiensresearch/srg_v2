// src/components/builder/helpers/ImageUploaderField.jsx
import { useState, useEffect } from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import { remove, getUrl } from 'aws-amplify/storage';
import {
    Box,
    Typography,
    IconButton,
    Alert,
    LinearProgress,
    Card,
    CardMedia,
    CardActions,
    Button
} from '@mui/material';
import { Trash2, Upload, ExternalLink } from 'lucide-react';

const ImageUploaderField = ({
    field,
    value,
    onChange,
    sectionId // Para crear carpetas únicas por sección
}) => {
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState(null);
    const [tempKeys, setTempKeys] = useState([]);

    const TEMP_FOLDER = `sections/images/temp/${sectionId}/`;
    const DEFINITIVE_FOLDER = `sections/images/${sectionId}/`;

    // Cargar preview si ya existe una imagen
    useEffect(() => {
        if (value && value.startsWith('sections/')) {
            loadImagePreview(value);
        } else if (value && value.startsWith('http')) {
            // Es una URL externa
            setImagePreview(value);
        } else {
            setImagePreview('');
        }
    }, [value]);

    const loadImagePreview = async (key) => {
        try {
            const result = await getUrl({ path: key });
            setImagePreview(result.url.toString());
        } catch (err) {
            console.error('Error loading image preview:', err);
            setImagePreview('');
        }
    };

    const handleUploadStart = () => {
        setUploading(true);
        setError(null);
    };

    const handleUploadError = (err) => {
        console.error('Error uploading:', err);
        setError('Error al subir la imagen. Intenta nuevamente.');
        setUploading(false);
    };

    const handleUploadSuccess = async ({ key }) => {
        try {
            setTempKeys(prev => [...prev, key]);

            // Mover a carpeta definitiva
            const timestamp = Date.now();
            const fileName = key.split('/').pop();
            const finalKey = `${DEFINITIVE_FOLDER}${timestamp}-${fileName}`;

            // En un escenario real, aquí llamarías a una función para mover el archivo
            // Por ahora, usamos la key temporal directamente
            const result = await getUrl({ path: key });
            setImagePreview(result.url.toString());

            // Actualizar el valor con la key final
            onChange(key); // O finalKey si implementas el movimiento

            setUploading(false);
            setError(null);
        } catch (err) {
            console.error('Error processing upload:', err);
            setError('Error al procesar la imagen');
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!value) return;

        try {
            // Solo intentar borrar si es una key de S3
            if (value.startsWith('builder/')) {
                await remove({ path: value });
            }
            onChange('');
            setImagePreview('');
        } catch (err) {
            console.error('Error deleting image:', err);
            setError('Error al eliminar la imagen');
        }
    };

    const handleUseURL = () => {
        const url = prompt('Ingresa la URL de la imagen:');
        if (url) {
            onChange(url);
            setImagePreview(url);
        }
    };

    return (
        <Box>
            <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                mb={1}
                display="block"
            >
                {field.label}
            </Typography>

            {/* Preview de imagen actual */}
            {imagePreview && (
                <Card sx={{ mb: 2, maxWidth: 400 }}>
                    <CardMedia
                        component="img"
                        image={imagePreview}
                        alt="Preview"
                        sx={{
                            maxHeight: 200,
                            objectFit: 'contain',
                            bgcolor: '#f5f5f5'
                        }}
                    />
                    <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Imagen actual
                        </Typography>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={handleDelete}
                            title="Eliminar imagen"
                        >
                            <Trash2 size={16} />
                        </IconButton>
                    </CardActions>
                </Card>
            )}

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Progress bar */}
            {uploading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary" mt={0.5}>
                        Subiendo imagen...
                    </Typography>
                </Box>
            )}

            {/* File Uploader */}
            {!uploading && (
                <Box sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 2,
                    bgcolor: '#fafafa',
                    mb: 2
                }}>
                    <FileUploader
                        acceptedFileTypes={['image/*']}
                        path={TEMP_FOLDER}
                        maxFileCount={1}
                        onUploadStart={handleUploadStart}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        processFile={({ file }) => ({
                            file,
                            key: `${Date.now()}-${file.name}`
                        })}
                    />
                </Box>
            )}

            {/* Opción de URL externa */}
            <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<ExternalLink size={16} />}
                onClick={handleUseURL}
                disabled={uploading}
            >
                O usar URL externa
            </Button>

            {/* Help text */}
            {field.help && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    {field.help}
                </Typography>
            )}
        </Box>
    );
};

export default ImageUploaderField;