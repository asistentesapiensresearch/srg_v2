import { useState, useEffect } from "react";
import {
    Box, Button, TextField, Typography, Paper, Grid,
    Divider, Avatar, Alert, InputAdornment
} from "@mui/material";
import {
    Save, Globe, Linkedin, Facebook, Instagram,
    User, Languages, Image as ImageIcon
} from "lucide-react";

import { FileUploader } from "@aws-amplify/ui-react-storage";
import { getUrl, remove } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import { Preloader } from "@src/components/preloader";
import { moveIconToDefinitiveFolder } from "@src/pages/admin/helpers/moveIconToDefinitiveFolder";

const client = generateClient();
const TEMP_FOLDER = "institutions/temp/";

const getSafeExtension = (fileName = "") => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "webp";
    return extension.replace(/[^a-z0-9]/g, "") || "webp";
};

const createSafeUploadProcessor = (prefix) => ({ file }) => ({
    file,
    key: `${prefix}-${Date.now()}.${getSafeExtension(file.name)}`
});

const normalizeOptionalUrl = (value) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return null;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
        return new URL(withProtocol).toString();
    } catch {
        throw new Error(`La URL "${value}" no es válida.`);
    }
};

export const AllyInstitutionForm = ({ institution, onCancel, onSaveSuccess }) => {

    // --- ESTADOS ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Campos Editables
    const [slogan, setSlogan] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [languagesStr, setLanguagesStr] = useState("");

    // Rector
    const [rectorName, setRectorName] = useState("");
    const [rectorLinkedin, setRectorLinkedin] = useState("");

    // Redes
    const [socialFacebook, setSocialFacebook] = useState("");
    const [socialInstagram, setSocialInstagram] = useState("");
    const [socialLinkedin, setSocialLinkedin] = useState("");

    // Imágenes (Keys y Previews)
    const [logoKey, setLogoKey] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [portadaKey, setPortadaKey] = useState("");
    const [portadaPreview, setPortadaPreview] = useState("");
    const [rectorKey, setRectorKey] = useState("");
    const [rectorPreview, setRectorPreview] = useState("");

    // --- CARGA INICIAL ---
    useEffect(() => {
        if (institution) {
            setSlogan(institution.slogan || "");
            setDescription(institution.description || "");
            setWebsite(institution.website || "");
            setRectorName(institution.rectorName || "");

            // Parsear Idiomas
            const langs = Array.isArray(institution.languages) ? institution.languages.join(", ") : "";
            setLanguagesStr(langs);

            // Parsear JSONs
            try {
                const rSocial = typeof institution.rectorSocial === 'string' ? JSON.parse(institution.rectorSocial) : institution.rectorSocial || {};
                setRectorLinkedin(rSocial.linkedin || "");

                const iSocial = typeof institution.socialMedia === 'string' ? JSON.parse(institution.socialMedia) : institution.socialMedia || {};
                setSocialFacebook(iSocial.facebook || "");
                setSocialInstagram(iSocial.instagram || "");
                setSocialLinkedin(iSocial.linkedin || "");
            } catch (e) { console.error(e); }

            // Cargar Imágenes
            if (institution.logo) {
                setLogoKey(institution.logo);
                getUrl({ path: institution.logo }).then(res => setLogoPreview(res.url.toString()));
            }
            if (institution.portadaPhoto) {
                setPortadaKey(institution.portadaPhoto);
                getUrl({ path: institution.portadaPhoto }).then(res => setPortadaPreview(res.url.toString()));
            }
            if (institution.rectorPhoto) {
                setRectorKey(institution.rectorPhoto);
                getUrl({ path: institution.rectorPhoto }).then(res => setRectorPreview(res.url.toString()));
            }
        }
    }, [institution]);

    // --- HANDLERS DE IMAGEN ---
    const handleUploadSuccess = async (key, type) => {
        // Obtenemos la URL temporal para mostrarla al usuario inmediatamente
        const res = await getUrl({ path: key });
        if (type === 'logo') {
            setLogoKey(key);
            setLogoPreview(res.url.toString());
        } else if (type === 'portada') {
            setPortadaKey(key);
            setPortadaPreview(res.url.toString());
        } else {
            setRectorKey(key);
            setRectorPreview(res.url.toString());
        }
    };

    // --- GUARDADO ---
    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. Procesar Imágenes (Mover de temp a final si cambiaron)
            let finalLogoKey = logoKey;
            if (logoKey && logoKey.includes(TEMP_FOLDER)) {
                finalLogoKey = await moveIconToDefinitiveFolder(TEMP_FOLDER, logoKey, `logo-${Date.now()}`);
                // Borrar anterior si existía
                if (institution.logo && institution.logo !== finalLogoKey) await remove({ path: institution.logo }).catch(() => { });
            }

            let finalPortadaKey = portadaKey;
            if (portadaKey && portadaKey.includes(TEMP_FOLDER)) {
                finalPortadaKey = await moveIconToDefinitiveFolder(TEMP_FOLDER, portadaKey, `portada-${Date.now()}`);
                if (institution.portadaPhoto && institution.portadaPhoto !== finalPortadaKey) await remove({ path: institution.portadaPhoto }).catch(() => { });
            }

            let finalRectorKey = rectorKey;
            if (rectorKey && rectorKey.includes(TEMP_FOLDER)) {
                finalRectorKey = await moveIconToDefinitiveFolder(TEMP_FOLDER, rectorKey, `rector-${Date.now()}`);
                if (institution.rectorPhoto && institution.rectorPhoto !== finalRectorKey) await remove({ path: institution.rectorPhoto }).catch(() => { });
            }

            // 2. Preparar Payloads
            const rectorSocialPayload = JSON.stringify({ linkedin: rectorLinkedin.trim() });
            const socialMediaPayload = JSON.stringify({
                facebook: socialFacebook.trim(),
                instagram: socialInstagram.trim(),
                linkedin: socialLinkedin.trim()
            });
            const languagesArray = languagesStr.split(",").map(s => s.trim()).filter(Boolean);
            const normalizedWebsite = normalizeOptionalUrl(website);

            // 3. Actualizar en Base de Datos (Solo campos permitidos)
            const { data: updatedInstitution, errors } = await client.models.Institution.update({
                id: institution.id,
                slogan: slogan.trim(),
                description: description.trim(),
                website: normalizedWebsite,
                logo: finalLogoKey,
                portadaPhoto: finalPortadaKey,
                rectorName: rectorName.trim(),
                rectorPhoto: finalRectorKey,
                rectorSocial: rectorSocialPayload,
                socialMedia: socialMediaPayload,
                languages: languagesArray
            }, {
                authMode: 'userPool'
            });

            if (errors?.length) {
                throw new Error(errors.map((item) => item.message).join("\n"));
            }

            if (!updatedInstitution?.id) {
                throw new Error("No se pudo confirmar que la institución haya sido actualizada.");
            }

            const { data: persistedInstitution, errors: fetchErrors } = await client.models.Institution.get({
                id: institution.id
            }, {
                authMode: 'userPool'
            });

            if (fetchErrors?.length) {
                throw new Error(fetchErrors.map((item) => item.message).join("\n"));
            }

            const savedInstitution = persistedInstitution || updatedInstitution;

            if ((savedInstitution.slogan || "") !== slogan.trim()) {
                throw new Error("El backend no devolvió el slogan actualizado. Intenta guardar nuevamente.");
            }

            setSuccess("Información actualizada correctamente.");
            await onSaveSuccess?.(savedInstitution);

        } catch (err) {
            console.error(err);
            setError(err?.message || "Ocurrió un error al guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} className="p-6 md:p-8 border border-gray-200 rounded-xl max-w-4xl mx-auto">

            {/* CABECERA (NO EDITABLE) */}
            <Box className="mb-6 border-b pb-4">
                <Typography variant="overline" className="text-gray-500 font-bold">
                    Editando Institución
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-800">
                    {institution?.name}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                    Tipo: {institution?.type} • {institution?.subtype}
                </Typography>
            </Box>

            {error && <Alert severity="error" className="mb-4">{error}</Alert>}
            {success && <Alert severity="success" className="mb-4">{success}</Alert>}

            <Grid container spacing={4}>

                {/* --- SECCIÓN 1: HEADER DEL MICROSITIO --- */}
                <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" className="font-bold mb-3 flex items-center gap-2">
                        <ImageIcon size={18} /> Logo Institucional
                    </Typography>

                    <Box className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 mb-4">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="h-32 object-contain mb-2" />
                        ) : (
                            <div className="h-32 flex items-center text-gray-400">Sin Logo</div>
                        )}
                        <FileUploader
                            acceptedFileTypes={['image/*']}
                            path={TEMP_FOLDER}
                            maxFileCount={1}
                            showThumbnails={false}
                            processFile={createSafeUploadProcessor('logo')}
                            onUploadSuccess={({ key }) => handleUploadSuccess(key, 'logo')}
                            displayText={{ dropFilesToUpload: "Subir nuevo logo", browseFiles: "Buscar" }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" className="font-bold mb-3 flex items-center gap-2">
                        <ImageIcon size={18} /> Header del micrositio
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Slogan del header"
                                multiline
                                rows={2}
                                fullWidth
                                value={slogan}
                                onChange={(e) => setSlogan(e.target.value)}
                                placeholder="Ej: Formamos líderes íntegros con visión global..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                <Typography variant="caption" className="text-gray-500 font-bold block mb-2">
                                    Imagen de fondo del header
                                </Typography>
                                {portadaPreview ? (
                                    <img src={portadaPreview} alt="Imagen de fondo" className="w-full h-44 object-cover rounded-lg border mb-3" />
                                ) : (
                                    <div className="h-44 flex items-center justify-center text-gray-400 border rounded-lg bg-white mb-3">
                                        Sin imagen de fondo
                                    </div>
                                )}
                                <FileUploader
                                    acceptedFileTypes={['image/*']}
                                    path={TEMP_FOLDER}
                                    maxFileCount={1}
                                    showThumbnails={false}
                                    processFile={createSafeUploadProcessor('portada')}
                                    onUploadSuccess={({ key }) => handleUploadSuccess(key, 'portada')}
                                    displayText={{ dropFilesToUpload: "Subir imagen de fondo", browseFiles: "Buscar" }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* --- SECCIÓN 2: INFORMACIÓN GENERAL --- */}
                <Grid item xs={12}>
                    <Typography variant="subtitle2" className="font-bold mb-3 flex items-center gap-2">
                        <Globe size={18} /> Información General
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Descripción / Perfil"
                                multiline
                                rows={4}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe brevemente la misión y visión del colegio..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Sitio Web Oficial"
                                fullWidth
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Globe size={18} /></InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Idiomas (separados por coma)"
                                fullWidth
                                value={languagesStr}
                                onChange={(e) => setLanguagesStr(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Languages size={18} /></InputAdornment>
                                }}
                                helperText="Ej: Español, Inglés, Francés"
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* --- SECCIÓN 3: RECTORÍA --- */}
                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle2" className="font-bold mb-4 flex items-center gap-2">
                        <User size={18} /> Información del Rector(a)
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3} className="flex flex-col items-center">
                            <Avatar src={rectorPreview} sx={{ width: 100, height: 100, mb: 2 }} />
                            <FileUploader
                                acceptedFileTypes={['image/*']}
                                path={TEMP_FOLDER}
                                maxFileCount={1}
                                showThumbnails={false}
                                processFile={createSafeUploadProcessor('rector')}
                                onUploadSuccess={({ key }) => handleUploadSuccess(key, 'rector')}
                            />
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Nombre Completo"
                                        fullWidth
                                        value={rectorName}
                                        onChange={(e) => setRectorName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="LinkedIn del Rector"
                                        fullWidth
                                        value={rectorLinkedin}
                                        onChange={(e) => setRectorLinkedin(e.target.value)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Linkedin size={18} /></InputAdornment>
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* --- SECCIÓN 4: REDES SOCIALES --- */}
                <Grid item xs={12}>
                    <Typography variant="subtitle2" className="font-bold mb-3">
                        Redes Sociales Institucionales
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Facebook URL"
                                fullWidth
                                value={socialFacebook}
                                onChange={(e) => setSocialFacebook(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Facebook size={18} /></InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Instagram URL"
                                fullWidth
                                value={socialInstagram}
                                onChange={(e) => setSocialInstagram(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Instagram size={18} /></InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="LinkedIn URL"
                                fullWidth
                                value={socialLinkedin}
                                onChange={(e) => setSocialLinkedin(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Linkedin size={18} /></InputAdornment>
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* --- BOTONES --- */}
                <Grid item xs={12} className="flex justify-end gap-3 mt-4">
                    <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={loading ? <Preloader size={16} /> : <Save size={18} />}
                        sx={{ px: 4 }}
                    >
                        Guardar Cambios
                    </Button>
                </Grid>

            </Grid>
        </Paper>
    );
};
