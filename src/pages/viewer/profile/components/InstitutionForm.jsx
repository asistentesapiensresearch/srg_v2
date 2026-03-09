import { useEffect, useState } from "react";
import { uploadData, remove, getUrl } from "aws-amplify/storage"; // 🔥 Agregamos uploadData
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Box,
    Avatar,
    Grid,
    Typography,
    IconButton,
    Divider
} from "@mui/material";
import {
    Camera,
    Building2, // Icono default para Institución
    User,      // Icono default para Rector
    X,
    Save
} from "lucide-react";

import { Preloader } from "@src/components/preloader";
import { InstitutionType, InstitutionSubtype } from "@core/domain/types/InstitutionTypes";
import { moveIconToDefinitiveFolder } from "@src/pages/admin/helpers/moveIconToDefinitiveFolder";

// ... (CONSTANTES DE LABELS IGUAL) ...
const TYPE_LABELS = {
    [InstitutionType.Educational]: "Educativa",
    [InstitutionType.Organizational]: "Organizacional",
    [InstitutionType.Other]: "Otra"
};

const SUBTYPE_LABELS = {
    [InstitutionSubtype.University]: "Universidad",
    [InstitutionSubtype.School]: "Colegio / Escuela",
    [InstitutionSubtype.NGO]: "ONG",
    [InstitutionSubtype.Governmental]: "Gubernamental",
    [InstitutionSubtype.Private]: "Privada",
    [InstitutionSubtype.Public]: "Pública"
};

export function InstitutionForm({ onClose, institution, store, isAdminView }) {

    // --- ESTADOS (Misma Lógica) ---
    const [name, setName] = useState(institution?.name || "");
    const [description, setDescription] = useState(institution?.description || "");
    const [website, setWebsite] = useState(institution?.website || "");

    const [path, setPath] = useState(institution?.path || "");
    const [isLinked, setIsLinked] = useState(institution?.isLinked || false);

    const [type, setType] = useState(institution?.type || InstitutionType.Educational);
    const [subtype, setSubtype] = useState(institution?.subtype || InstitutionSubtype.University);
    const [rectorName, setRectorName] = useState(institution?.rectorName || "");
    const [rectorLinkedin, setRectorLinkedin] = useState("");
    const [socialFacebook, setSocialFacebook] = useState("");
    const [socialInstagram, setSocialInstagram] = useState("");
    const [socialLinkedin, setSocialLinkedin] = useState("");
    const [languagesStr, setLanguagesStr] = useState("");

    // Imágenes
    const [logoKey, setLogoKey] = useState(institution?.logo || "");
    const [logoPreview, setLogoPreview] = useState("");

    const [rectorPhotoKey, setRectorPhotoKey] = useState(institution?.rectorPhoto || "");
    const [rectorPhotoPreview, setRectorPhotoPreview] = useState("");

    const [uploading, setUploading] = useState(false);
    const [tempKeys, setTempKeys] = useState([]); // Para borrar si cancela
    const [errors, setErrors] = useState({});

    const TEMP_FOLDER = "institutions/temp/";

    // --- CARGAR DATOS AL EDITAR (Igual) ---
    useEffect(() => {
        if (institution) {
            setName(institution.name);
            setDescription(institution.description || "");
            setWebsite(institution.website || "");
            setPath(institution.path || "");
            setIsLinked(institution.isLinked || false);
            setType(institution.type || InstitutionType.Educational);
            setSubtype(institution.subtype || InstitutionSubtype.University);
            setRectorName(institution.rectorName || "");

            try {
                const rSocial = typeof institution.rectorSocial === 'string' ? JSON.parse(institution.rectorSocial) : institution.rectorSocial || {};
                setRectorLinkedin(rSocial.linkedin || "");

                const iSocial = typeof institution.socialMedia === 'string' ? JSON.parse(institution.socialMedia) : institution.socialMedia || {};
                setSocialFacebook(iSocial.facebook || "");
                setSocialInstagram(iSocial.instagram || "");
                setSocialLinkedin(iSocial.linkedin || "");

                const langs = Array.isArray(institution.languages) ? institution.languages.join(", ") : "";
                setLanguagesStr(langs);
            } catch (e) { console.error(e); }

            if (institution.logo) {
                setLogoKey(institution.logo);
                getUrl({ path: institution.logo }).then((res) => setLogoPreview(res.url.toString())).catch(() => { });
            }
            if (institution.rectorPhoto) {
                setRectorPhotoKey(institution.rectorPhoto);
                getUrl({ path: institution.rectorPhoto }).then((res) => setRectorPhotoPreview(res.url.toString())).catch(() => { });
            }
        }
    }, [institution]);

    // --- 🔥 NUEVO HANDLER DE IMAGEN (GENÉRICO) ---
    // Reemplaza al FileUploader para permitir diseño personalizado
    const handleImageUpload = async (e, target) => { // target: 'logo' | 'rector'
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            // 1. Path temporal
            const key = `${TEMP_FOLDER}${target}-${Date.now()}-${file.name}`;

            // 2. Subir
            await uploadData({ path: key, data: file }).result;

            // 3. Preview inmediata
            const objectUrl = URL.createObjectURL(file);

            // 4. Actualizar estado según target
            if (target === 'logo') {
                setLogoKey(key);
                setLogoPreview(objectUrl);
            } else {
                setRectorPhotoKey(key);
                setRectorPhotoPreview(objectUrl);
            }

            // Guardamos en tempKeys para limpieza si cancela
            setTempKeys(prev => [...prev, key]);

        } catch (error) {
            console.error("Error uploading image:", error);
            setErrors(prev => ({ ...prev, form: "Error subiendo imagen" }));
        } finally {
            setUploading(false);
        }
    };

    // --- GUARDAR (Lógica intacta) ---
    const handleSave = async () => {
        try {
            setUploading(true);
            setErrors({});

            // 1. Procesar Logo (Mover de Temp a Definitiva)
            let currentLogoKey = logoKey;
            if (currentLogoKey && currentLogoKey.includes(TEMP_FOLDER)) {
                try {
                    const newKey = await moveIconToDefinitiveFolder(TEMP_FOLDER, currentLogoKey, `logo-${Date.now()}`);
                    currentLogoKey = newKey;
                    setLogoKey(newKey); // Actualizar estado local
                    if (institution?.logo && institution.logo !== newKey) {
                        await remove({ path: institution.logo }).catch(console.warn);
                    }
                } catch (moveError) {
                    setErrors({ form: "Error al procesar el logo." });
                    setUploading(false);
                    return;
                }
            }

            // 2. Procesar Rector (Mover de Temp a Definitiva)
            let currentRectorKey = rectorPhotoKey;
            if (currentRectorKey && currentRectorKey.includes(TEMP_FOLDER)) {
                try {
                    const newKey = await moveIconToDefinitiveFolder(TEMP_FOLDER, currentRectorKey, `rector-${Date.now()}`);
                    currentRectorKey = newKey;
                    setRectorPhotoKey(newKey); // Actualizar estado local
                    if (institution?.rectorPhoto && institution.rectorPhoto !== newKey) {
                        await remove({ path: institution.rectorPhoto }).catch(console.warn);
                    }
                } catch (moveError) {
                    setErrors({ form: "Error al procesar la foto del rector." });
                    setUploading(false);
                    return;
                }
            }

            // 3. Payloads
            const rectorSocialPayload = JSON.stringify({ linkedin: rectorLinkedin });
            const socialMediaPayload = JSON.stringify({ facebook: socialFacebook, instagram: socialInstagram, linkedin: socialLinkedin });
            const languagesArray = languagesStr.split(",").map(s => s.trim()).filter(Boolean);

            // 4. Store
            const { institution: instDB, errors: apiErrors } = await store({
                id: institution?.id,
                name,
                description,
                website: website.trim() === "" ? null : website,
                path: path.trim() === "" ? null : path,
                isLinked,
                type,
                subtype,
                logo: currentLogoKey,
                rectorName,
                rectorPhoto: currentRectorKey,
                rectorSocial: rectorSocialPayload,
                socialMedia: socialMediaPayload,
                languages: languagesArray
            });

            if (apiErrors) {
                setErrors(apiErrors);
            } else if (instDB) {
                onClose(instDB);
            }

        } catch (error) {
            console.error("Error crítico:", error);
            setErrors({ form: "Error inesperado al guardar." });
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = async () => {
        // Limpiar archivos temporales si se subieron y no se guardaron
        for (const key of tempKeys) {
            if (key.includes(TEMP_FOLDER)) await remove({ path: key }).catch(() => { });
        }
        onClose(null);
    };

    return (
        <Dialog open={true} onClose={handleCancel} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>

            {/* --- HEADER --- */}
            <DialogTitle sx={{ borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight="bold">
                    {institution?.id ? "Editar Institución" : "Nueva Institución"}
                </Typography>
                <IconButton onClick={handleCancel} size="small"><X size={20} /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={4}>

                    {/* ERRORES GENERALES */}
                    {errors.form && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                            {errors.form}
                        </div>
                    )}

                    {/* --- 1. SECCIÓN DE LOGO PRINCIPAL (Estilo Perfil) --- */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative">
                            <Avatar
                                src={logoPreview}
                                variant="rounded"
                                sx={{
                                    width: 120, height: 120,
                                    bgcolor: 'grey.100',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Building2 size={40} className="text-gray-300" />
                            </Avatar>

                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="logo-upload-input"
                                type="file"
                                onChange={(e) => handleImageUpload(e, 'logo')}
                            />
                            <label htmlFor="logo-upload-input">
                                <Box sx={{
                                    position: 'absolute', bottom: -10, right: -10,
                                    bgcolor: 'primary.main', borderRadius: '50%', p: 1,
                                    cursor: 'pointer', border: '4px solid white', boxShadow: 1,
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }}>
                                    <Camera size={20} color="white" />
                                </Box>
                            </label>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                            Logo Institucional
                        </Typography>
                    </Box>

                    {/* --- 2. SWITCH VINCULADO (Solo Admin) --- */}
                    {!isAdminView && (
                        <Box display="flex" justifyContent="center">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isLinked}
                                        onChange={(e) => setIsLinked(e.target.checked)}
                                        color="success"
                                    />
                                }
                                label={
                                    <Typography fontWeight="medium" color={isLinked ? "success.main" : "text.secondary"}>
                                        {isLinked ? "Institución Vinculada (Activa)" : "Institución No Vinculada"}
                                    </Typography>
                                }
                                sx={{ border: '1px solid #e2e8f0', borderRadius: 4, pr: 2, pl: 1, bgcolor: '#f8fafc' }}
                            />
                        </Box>
                    )}

                    {/* --- 3. DATOS GENERALES --- */}
                    <Grid container spacing={3}>
                        {!isAdminView && (
                            <>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Nombre Oficial"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        fullWidth
                                        required
                                        error={!!errors.name}
                                    />
                                </Grid>
                                <Grid size={{ sx: 12, md: 6 }}>
                                    <TextField
                                        label="Path (URL)"
                                        value={path}
                                        onChange={(e) => setPath(e.target.value)}
                                        fullWidth
                                        placeholder="/ejemplo-universidad"
                                    />
                                </Grid>
                                <Grid size={{ sx: 12, md: 6 }}>
                                    <TextField
                                        select
                                        label="Tipo"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        fullWidth
                                    >
                                        {Object.values(InstitutionType).map((v) => (
                                            <MenuItem key={v} value={v}>{TYPE_LABELS[v]}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ sx: 12, md: 6 }}>
                                    <TextField
                                        select
                                        label="Categoría"
                                        value={subtype}
                                        onChange={(e) => setSubtype(e.target.value)}
                                        fullWidth
                                    >
                                        {Object.values(InstitutionSubtype).map((v) => (
                                            <MenuItem key={v} value={v}>{SUBTYPE_LABELS[v]}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        label="Sitio Web Oficial"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        fullWidth
                                        InputProps={{ startAdornment: <span className="text-gray-400 mr-2 text-sm">https://</span> }}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Descripción / Reseña"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>

                    <Divider />

                    {/* --- 4. RECTORÍA (Diseño Híbrido) --- */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Información de Rectoría
                        </Typography>
                        <Grid container spacing={3} alignItems="center">

                            {/* FOTO RECTOR (Izquierda) */}
                            <Grid size={{ xs: 12, md: 3 }} display="flex" justifyContent="center">
                                <Box position="relative">
                                    <Avatar
                                        src={rectorPhotoPreview}
                                        sx={{ width: 90, height: 90, border: '1px solid #e0e0e0' }}
                                    >
                                        <User />
                                    </Avatar>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="rector-upload-input"
                                        type="file"
                                        onChange={(e) => handleImageUpload(e, 'rector')}
                                    />
                                    <label htmlFor="rector-upload-input">
                                        <Box sx={{
                                            position: 'absolute', bottom: 0, right: 0,
                                            bgcolor: 'white', borderRadius: '50%', p: 0.5,
                                            cursor: 'pointer', border: '1px solid #ccc',
                                            '&:hover': { bgcolor: '#f5f5f5' }
                                        }}>
                                            <Camera size={16} className="text-gray-600" />
                                        </Box>
                                    </label>
                                </Box>
                            </Grid>

                            {/* DATOS RECTOR (Derecha) */}
                            <Grid size={{ xs: 12, md: 9 }}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="Nombre del Rector(a)"
                                            value={rectorName}
                                            onChange={(e) => setRectorName(e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            label="LinkedIn del Rector"
                                            value={rectorLinkedin}
                                            onChange={(e) => setRectorLinkedin(e.target.value)}
                                            fullWidth
                                            size="small"
                                            placeholder="URL Perfil"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    {/* --- 5. REDES E IDIOMAS --- */}
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Redes Sociales e Idiomas
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Facebook"
                                    value={socialFacebook}
                                    onChange={(e) => setSocialFacebook(e.target.value)}
                                    fullWidth size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Instagram"
                                    value={socialInstagram}
                                    onChange={(e) => setSocialInstagram(e.target.value)}
                                    fullWidth size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="LinkedIn Institución"
                                    value={socialLinkedin}
                                    onChange={(e) => setSocialLinkedin(e.target.value)}
                                    fullWidth size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Idiomas ofrecidos"
                                    value={languagesStr}
                                    onChange={(e) => setLanguagesStr(e.target.value)}
                                    fullWidth size="small"
                                    helperText="Separados por comas (Ej: Inglés, Francés, Alemán)"
                                />
                            </Grid>
                        </Grid>
                    </Box>

                </Box>
            </DialogContent>

            {/* --- FOOTER ACCIONES --- */}
            <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
                <Button onClick={handleCancel} color="inherit" sx={{ textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={uploading}
                    startIcon={uploading ? <Preloader size={16} /> : <Save size={18} />}
                    sx={{ px: 4, textTransform: 'none', borderRadius: 2 }}
                >
                    {uploading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}