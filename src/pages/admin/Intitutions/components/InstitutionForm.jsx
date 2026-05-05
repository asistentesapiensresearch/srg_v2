import { useEffect, useState } from "react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { remove, getUrl } from "aws-amplify/storage";
import {
    Button,
    Dialog,
    DialogTitle,
    TextField,
    InputLabel,
    FormGroup,
    FormControl,
    MenuItem,
    FormHelperText,
    Switch,            // 🔥 Nuevo import
    FormControlLabel   // 🔥 Nuevo import
} from "@mui/material";
import { Preloader } from "@src/components/preloader";
import { processTempFile } from "../../helpers/proccessTempFile";
import { InstitutionType, InstitutionSubtype } from "@core/domain/types/InstitutionTypes";

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

export function InstitutionForm({ onClose, institution, store }) {

    // --- ESTADOS ---
    const [name, setName] = useState(institution?.name || "");
    const [description, setDescription] = useState(institution?.description || "");
    const [slogan, setSlogan] = useState(institution?.slogan || "");
    const [website, setWebsite] = useState(institution?.website || "");

    // 🔥 NUEVOS ESTADOS
    const [path, setPath] = useState(institution?.path || "");
    const [dane, setDane] = useState(institution?.dane || "");
    const [isLinked, setIsLinked] = useState(institution?.isLinked || false);
    
    const [type, setType] = useState(institution?.type || InstitutionType.Educational);
    const [subtype, setSubtype] = useState(institution?.subtype || InstitutionSubtype.University);
    const [rectorName, setRectorName] = useState(institution?.rectorName || "");
    const [rectorLinkedin, setRectorLinkedin] = useState("");
    const [rectorWeb, setRectorWeb] = useState("");
    const [rectorInstagram, setRectorInstagram] = useState("");
    const [rectorFacebook, setRectorFacebook] = useState("");
    const [rectorYoutube, setRectorYoutube] = useState("");
    const [rectorCV, setRectorCV] = useState("");
    const [rectorDescription, setRectorDescription] = useState(institution?.rectorDescription || "");
    const [rectorTestimonial, setRectorTestimonial] = useState(institution?.dane || "");
    const [socialFacebook, setSocialFacebook] = useState("");
    const [socialInstagram, setSocialInstagram] = useState("");
    const [socialTwitter, setSocialTwitter] = useState("");
    const [socialYoutube, setSocialYoutube] = useState("");
    const [languagesStr, setLanguagesStr] = useState("");

    // Estados para contenidos embebidos
    const [embedFacebook, setEmbedFacebook] = useState("");
    const [embedInstagram, setEmbedInstagram] = useState("");
    const [embedGoogleMap, setEmbedGoogleMap] = useState("");

    // Estados para sección de admisiones
    const [admisionesName, setAdmisionesName] = useState("");
    const [admisionesEmail, setAdmisionesEmail] = useState("");
    const [admisionesPhone, setAdmisionesPhone] = useState("");
    const [admisionesLocation, setAdmisionesLocation] = useState("");
    const [admisionesLink, setAdmisionesLink] = useState("");
    const [admisionesSchedule, setAdmisionesSchedule] = useState("");
    const [admisionesMonth, setAdmisionesMonth] = useState("");
    const [admisionesInformationLink, setAdmisionesInformationLink] = useState("");

    // Imágenes
    const [logoKey, setLogoKey] = useState(institution?.logo || "");
    const [logoPreview, setLogoPreview] = useState("");
    
    
    const [portadaPhotoKey, setPortadaPhotoKey] = useState(institution?.portadaPhoto || "");
    const [portadaPhotoPreview, setPortadaPhotoPreview] = useState("");

    const [rectorPhotoKey, setRectorPhotoKey] = useState(institution?.rectorPhoto || "");
    const [rectorPhotoPreview, setRectorPhotoPreview] = useState("");

    const [photoAdmisionesKey, setPhotoAdmisionesKey] = useState(
        typeof institution?.admisiones === "string"
        ? JSON.parse(institution.admisiones)?.photo || ""
        : ""
    );
    const [photoAdmisionesPreview, setPhotoAdmisionesPreview] = useState("");

    //Audio mp3 admisiones
    const [audioAdmisionesKey, setAudioAdmisionesKey] = useState(
        typeof institution?.admisiones === "string"
        ? JSON.parse(institution.admisiones)?.audio || ""
        : ""
    );
    const [audioAdmisionesPreview, setAudioAdmisionesPreview] = useState("");

    const [uploading, setUploading] = useState(false);
    const [tempKeys, setTempKeys] = useState([]);
    const [errors, setErrors] = useState({});

    const TEMP_FOLDER = "institutions/temp/";

    // --- CARGAR DATOS AL EDITAR ---
    useEffect(() => {
        if (institution) {
            setName(institution.name);
            setDescription(institution.description || "");
            setSlogan(institution.slogan || "");
            setWebsite(institution.website || "");

            // 🔥 Cargar nuevos campos
            setPath(institution.path || "");
            setDane(institution.dane || "");
            setIsLinked(institution.isLinked || false);

            setType(institution.type || InstitutionType.Educational);
            setSubtype(institution.subtype || InstitutionSubtype.University);
            setRectorName(institution.rectorName || "");
            setRectorDescription(institution.rectorDescription || "");
            setRectorTestimonial(institution.rectorTestimonial || "");

            try {
                const rSocial = typeof institution.rectorSocial === 'string' ? JSON.parse(institution.rectorSocial) : institution.rectorSocial || {};
                setRectorLinkedin(rSocial.linkedin || "");
                setRectorWeb(rSocial.website || "");
                setRectorInstagram(rSocial.instagram || "");
                setRectorFacebook(rSocial.facebook || "");
                setRectorYoutube(rSocial.youtube || "");
                setRectorCV(rSocial.cvlac || "");

                const iSocial = typeof institution.socialMedia === 'string' ? JSON.parse(institution.socialMedia) : institution.socialMedia || {};
                setSocialFacebook(iSocial.facebook || "");
                setSocialInstagram(iSocial.instagram || "");
                setSocialTwitter(iSocial.twitter || "");
                setSocialYoutube(iSocial.youtube || "");
               
                const embed = typeof institution.embed === 'string' ? JSON.parse(institution.embed) : institution.embed || {};
                setEmbedFacebook(embed.facebook || "");
                setEmbedInstagram(embed.instagram || "");
                setEmbedGoogleMap(embed.googleMap || "");

                const admisiones = typeof institution.admisiones === 'string' ? JSON.parse(institution.admisiones) : institution.admisiones || {};
                setAdmisionesName(admisiones.name || "");
                setAdmisionesEmail(admisiones.email || "");
                setAdmisionesPhone(admisiones.phone || "");
                setAdmisionesLocation(admisiones.location || "");
                setAdmisionesLink(admisiones.link || "");
                setAdmisionesSchedule(admisiones.schedule || "");
                setAdmisionesMonth(admisiones.monthAdmision || "");
                setAdmisionesInformationLink(admisiones.informationLink || "");
                
                // Aquí debo poner la imagen de admisiones
                if(admisiones.photo) {
                    setPhotoAdmisionesKey(admisiones.photo || "");
                    getUrl({ path: admisiones.photo }).then((res) => setPhotoAdmisionesPreview(res.url.toString())).catch(() => { });
                }

                // Agrego audio admisiones
                if(admisiones.audio) {
                    setAudioAdmisionesKey(admisiones.audio || "");
                    getUrl({ path: admisiones.audio }).then((res) => setAudioAdmisionesPreview(res.url.toString())).catch(() => { });
                }

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
            if(institution.portadaPhoto) {
                setPortadaPhotoKey(institution.portadaPhoto);
                getUrl({ path: institution.portadaPhoto }).then((res) => setPortadaPhotoPreview(res.url.toString())).catch(() => { });
            }
        }
    }, [institution]);

    // --- HANDLERS UPLOAD ---
    const handleUploadStart = () => setUploading(true);
    const handleUploadError = (err) => { console.error(err); setUploading(false); };

    const handleLogoSuccess = async ({ key }) => {
        setLogoKey(key);
        setTempKeys(prev => [...prev, key]);
        getUrl({ path: key }).then(res => setLogoPreview(res.url.toString()));
        setUploading(false);
        setErrors(prev => ({ ...prev, logo: null }));
    };

    const handleRectorPhotoSuccess = async ({ key }) => {
        setRectorPhotoKey(key);
        setTempKeys(prev => [...prev, key]);
        getUrl({ path: key }).then(res => setRectorPhotoPreview(res.url.toString()));
        setUploading(false);
    };

    const handlePortadaPhotoSuccess = async ({key}) => {
        setPortadaPhotoKey(key);
        setTempKeys(prev => [...prev, key]);
        getUrl({path: key}).then(res => setPortadaPhotoPreview(res.url.toString()));
        setUploading(false);
    }
    
    const handlePhotoAmissionSuccess = async ({key}) => {
        setPhotoAdmisionesKey(key);
        setTempKeys(prev => [...prev, key]);
        getUrl({path: key}).then(res => setPhotoAdmisionesPreview(res.url.toString()));
        setUploading(false);
    }

    const handleAudioAdmisionesSuccess = async ({key}) => {
        setAudioAdmisionesKey(key);
        setTempKeys(prev => [...prev, key]);
        getUrl({path: key}).then(res => setAudioAdmisionesPreview(res.url.toString()));
        setUploading(false);
    }

    // --- GUARDAR ---
    const handleSave = async () => {
        try {
            setUploading(true);
            setErrors({});
            let currentLogoKey = await processTempFile({
                currentKey: logoKey,
                oldKey: institution?.logo,
                fileNamePrefix: "logo",
                setKey: setLogoKey,
                errorKey: "logo",
                TEMP_FOLDER,
                setErrors,
                setUploading,
                allowedExtensions: ["webp"]
            });

            let currentRectorKey = await processTempFile({
                currentKey: rectorPhotoKey,
                oldKey: institution?.rectorPhoto,
                fileNamePrefix: "rector",
                setKey: setRectorPhotoKey,
                errorKey: "photoRector",
                TEMP_FOLDER,
                setErrors,
                setUploading,
                allowedExtensions: ["webp"]
            });

            let currentPortadaKey = await processTempFile({
                currentKey: portadaPhotoKey,
                oldKey: institution?.portadaPhoto,
                fileNamePrefix: "portada",
                errorKey: "portadaPhoto",
                setKey: setPortadaPhotoKey,
                TEMP_FOLDER,
                setErrors,
                setUploading,
                allowedExtensions: ["webp"]
            });

            const admisiones =
                typeof institution?.admisiones === "string"
                    ? JSON.parse(institution.admisiones)
                    : institution?.admisiones || {};

            let currentPhotoAdmisionesKey = await processTempFile({
                currentKey: photoAdmisionesKey,
                oldKey: admisiones?.photo,
                fileNamePrefix: "photo-admisiones",
                setKey: setPhotoAdmisionesKey,
                errorKey: "photoAdmisiones",
                TEMP_FOLDER,
                setErrors,
                setUploading,
                allowedExtensions: ["webp"]
            });

            let currentAudioAdmisionesKey = await processTempFile({
                currentKey: audioAdmisionesKey,
                oldKey: admisiones?.audio,
                fileNamePrefix: "audio-admisiones",
                setKey: setAudioAdmisionesKey,
                errorKey: "audioAdmisiones",
                TEMP_FOLDER,
                setErrors,
                setUploading,
                allowedExtensions: ["mp3"]
            });

            // 3. Preparar JSONs
            const rectorSocialPayload = JSON.stringify({ linkedin: rectorLinkedin, website: rectorWeb, instagram: rectorInstagram, facebook: rectorFacebook, youtube: rectorYoutube, cvlac: rectorCV  });
            const socialMediaPayload = JSON.stringify({
                facebook: socialFacebook,
                instagram: socialInstagram,
                twitter: socialTwitter,
                youtube: socialYoutube
            });
            // Para contenidos embebidos
            const embedPayload = JSON.stringify({
                facebook: embedFacebook,
                instagram: embedInstagram,
                googleMap: embedGoogleMap
            });
            // Para admisiones
            const admisionesPayload = JSON.stringify({
                name: admisionesName,
                email: admisionesEmail,
                phone: admisionesPhone,
                location: admisionesLocation,
                link: admisionesLink,
                schedule: admisionesSchedule,
                monthAdmision: admisionesMonth,
                informationLink: admisionesInformationLink,
                photo: currentPhotoAdmisionesKey,
                audio: currentAudioAdmisionesKey
            });
            const languagesArray = languagesStr.split(",").map(s => s.trim()).filter(Boolean);

            // 4. Enviar al Store
            const { institution: instDB, errors: apiErrors } = await store({
                id: institution?.id,
                name,
                slogan,
                description,
                dane: dane.trim(),
                website: website.trim() === "" ? null : website,

                // 🔥 NUEVOS CAMPOS EN EL PAYLOAD
                path: path.trim() === "" ? null : path,
                isLinked,

                type,
                subtype,
                logo: currentLogoKey,
                portadaPhoto: currentPortadaKey,
                rectorName,
                rectorPhoto: currentRectorKey,
                rectorSocial: rectorSocialPayload,
                rectorDescription,
                rectorTestimonial,
                socialMedia: socialMediaPayload,
                embed: embedPayload,
                admisiones: admisionesPayload,
                languages: languagesArray
            });

            if (apiErrors) {
                setErrors(apiErrors);
            } else if (instDB) {
                onClose(instDB);
            }

        } catch (error) {
            /* console.error("Error crítico saving institution:", error);
            setErrors({ form: "Error inesperado al guardar. Revisa la consola." }); */
            console.error("Error saving institution:", error);
            if (error?.type === "VALIDATION_ERROR") return
            setErrors((prev) => ({
                ...prev,
                form: "Revisar los campos que falla.",
            }));
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = async () => {
        for (const key of tempKeys) {
            if (key.includes(TEMP_FOLDER)) await remove({ path: key }).catch(() => { });
        }
        onClose(null);
    };

    return (
        <Dialog open={true} onClose={handleCancel} maxWidth="md" fullWidth>
            <DialogTitle>{institution?.id ? "Editar Institución" : "Crear nueva Institución"}</DialogTitle>

            <FormGroup className="p-4 flex flex-col gap-4">

                {errors.form && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                        {errors.form}
                    </div>
                )}

                {/* 🔥 NUEVO SWITCH DE VINCULADA */}
                <div className="flex justify-end">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isLinked}
                                onChange={(e) => setIsLinked(e.target.checked)}
                                color="success" // Verde para indicar activo/vinculado
                            />
                        }
                        label={isLinked ? "Institución Vinculada (Activa)" : "Institución No Vinculada"}
                        className="border border-gray-200 rounded-lg pr-4 pl-2 bg-gray-50"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    {/* 🔥 NUEVO CAMPO PATH */}
                    <TextField
                        label="Path (URL Amigable)"
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        fullWidth
                        placeholder="/universidad-nacional"
                        helperText="Identificador único para la URL (ej: /nombre-cole)"
                    />

                    <TextField
                        label="Sitio Web"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Número DANE de la institución"
                        value={dane}
                        onChange={(e) => setDane(e.target.value)}
                        fullWidth
                        placeholder="Ej: 54223445..."
                        helperText="Identificador único de la institución"
                    />

                    <TextField
                        select
                        label="Tipo de Institución"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        fullWidth
                    >
                        {Object.values(InstitutionType).map((optionValue) => (
                            <MenuItem key={optionValue} value={optionValue}>
                                {TYPE_LABELS[optionValue] || optionValue}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Categoría / Subtipo"
                        value={subtype}
                        onChange={(e) => setSubtype(e.target.value)}
                        fullWidth
                    >
                        {Object.values(InstitutionSubtype).map((optionValue) => (
                            <MenuItem key={optionValue} value={optionValue}>
                                {SUBTYPE_LABELS[optionValue] || optionValue}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <TextField
                    label="Slogan"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    helperText="Ej: Formamos líderes íntegros con una visión global, fundamentados en valores cristianos y excelencia académica bilingue"
                />

                <TextField
                    label="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                />

                <FormControl fullWidth error={!!errors.logo}>
                    <InputLabel style={{ position: 'relative', transform: 'none', marginBottom: '8px' }}>
                        Logo Institucional
                    </InputLabel>
                    <p className="text-blue-700">Solo se permite formato .webp y se recomienda el siguiente tamaño: </p>
                    {logoPreview && (
                        <div className="mb-2 max-w-20">
                            <img src={logoPreview} alt="Logo" className="w-full object-contain border rounded" />
                        </div>
                    )}
                    <FileUploader
                        acceptedFileTypes={["image/*", ".webp"]}
                        path={TEMP_FOLDER}
                        maxFileCount={1}
                        onUploadStart={handleUploadStart}
                        onUploadSuccess={handleLogoSuccess}
                        onUploadError={handleUploadError}
                        showThumbnails={false}
                        processFile={({ file }) => ({ file, key: `logo-${Date.now()}-${file.name}` })}
                    />
                    {errors.logo && <FormHelperText>{errors.logo}</FormHelperText>}
                </FormControl>
                
                <FormControl fullWidth error={!!errors.portadaPhoto}>
                    <InputLabel style={{ position: 'relative', transform: 'none', marginBottom: '8px' }}>
                        Foto de Portada
                    </InputLabel>
                    <p className="text-blue-700">Solo se permite formato .webp y se recomienda el siguiente tamaño: </p>
                    {portadaPhotoPreview && (
                        <div className="mb-2 max-w-20">
                            <img src={portadaPhotoPreview} alt="Portada" className="w-full object-contain border rounded" />
                        </div>
                    )}
                    <FileUploader
                        acceptedFileTypes={["image/*"]}
                        path={TEMP_FOLDER}
                        maxFileCount={1}
                        onUploadStart={handleUploadStart}
                        onUploadSuccess={handlePortadaPhotoSuccess}
                        onUploadError={handleUploadError}
                        showThumbnails={false}
                        processFile={({ file }) => ({ file, key: `portada-${Date.now()}-${file.name}` })}
                    />
                    {errors.portadaPhoto && <FormHelperText>{errors.portadaPhoto}</FormHelperText>}
                </FormControl>

                <h3 className="font-bold text-gray-700 mt-2 border-b">Rectoría</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Nombre del Rector"
                        value={rectorName}
                        onChange={(e) => setRectorName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="LinkedIn Rector"
                        value={rectorLinkedin}
                        onChange={(e) => setRectorLinkedin(e.target.value)}
                        fullWidth
                        placeholder="https://linkedin.com/in/..."
                    />
                    <TextField
                        label="Web Rector"
                        value={rectorWeb}
                        onChange={(e) => setRectorWeb(e.target.value)}
                        fullWidth
                        placeholder="https://....."
                    />
                    <TextField
                        label="Facebook Rector"
                        value={rectorFacebook}
                        onChange={(e) => setRectorFacebook(e.target.value)}
                        fullWidth
                        placeholder="https://facebook.com/....."
                    />
                    <TextField
                        label="Instagram Rector"
                        value={rectorInstagram}
                        onChange={(e) => setRectorInstagram(e.target.value)}
                        fullWidth
                        placeholder="https://Instagram.com/....."
                    />
                    <TextField
                        label="Youtube Rector"
                        value={rectorYoutube}
                        onChange={(e) => setRectorYoutube(e.target.value)}
                        fullWidth
                        placeholder="https://youtube.com/....."
                    />
                    <TextField
                        label="CVLAC Rector"
                        value={rectorCV}
                        onChange={(e) => setRectorCV(e.target.value)}
                        fullWidth
                        placeholder="https://scienti.minciencias.gov.co/cvlac/....."
                    />
                </div>
                <TextField
                    label="Testimonial del rector respeto a SRG máximo 18 palabras"
                    value={rectorTestimonial}
                    onChange={(e) => setRectorTestimonial(e.target.value)}
                    helperText="Ej: Ser miembros de Sapiens ha sido una de las mejores decisiones de nuestra institución."
                    fullWidth
                    multiline
                    rows={2}
                />
                <TextField
                    label="Descripción del rector e invitación"
                    value={rectorDescription}
                    onChange={(e) => setRectorDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                />
                <FormControl fullWidth error={!!errors.photoRector}>
                    <InputLabel style={{ position: 'relative', transform: 'none', marginBottom: '8px' }}>
                        Foto del Rector
                    </InputLabel>
                    {rectorPhotoPreview && (
                        <div className="mb-2 max-w-20">
                            <img src={rectorPhotoPreview} alt="Rector" className="w-full object-cover border rounded" />
                        </div>
                    )}
                    <p className="text-blue-700">Solo se permite formato .webp y se recomienda el siguiente tamaño: </p>
                    <FileUploader
                        acceptedFileTypes={["image/*"]}
                        path={TEMP_FOLDER}
                        maxFileCount={1}
                        onUploadStart={handleUploadStart}
                        onUploadSuccess={handleRectorPhotoSuccess}
                        onUploadError={handleUploadError}
                        showThumbnails={false}
                        processFile={({ file }) => ({ file, key: `rector-${Date.now()}-${file.name}` })}
                    />
                     {errors.photoRector && <FormHelperText>{errors.photoRector}</FormHelperText>}
                </FormControl>

                <h3 className="font-bold text-gray-700 mt-2 border-b">Admisiones</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                        label="Nombre encargado"
                        value={admisionesName}
                        onChange={(e) => setAdmisionesName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Correo"
                        value={admisionesEmail}
                        onChange={(e) => setAdmisionesEmail(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Celular/WhatsApp"
                        value={admisionesPhone}
                        onChange={(e) => setAdmisionesPhone(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Ubicación"
                        value={admisionesLocation}
                        onChange={(e) => setAdmisionesLocation(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Horario de atención"
                        value={admisionesSchedule}
                        onChange={(e) => setAdmisionesSchedule(e.target.value)}
                        fullWidth
                        placeholder="Ej: Lun – Vie · 7:00 am – 5:00 pm"
                    />
                    <TextField
                        label="Mes de Admisión"
                        value={admisionesMonth}
                        onChange={(e) => setAdmisionesMonth(e.target.value)}
                        fullWidth
                        placeholder="Ej: SEPT"
                    />
                    <TextField
                        label="Link de Admisiones"
                        value={admisionesLink}
                        onChange={(e) => setAdmisionesLink(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Link de Más Información"
                        value={admisionesInformationLink}
                        onChange={(e) => setAdmisionesInformationLink(e.target.value)}
                        fullWidth
                        placeholder="https://..."
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <FormControl fullWidth error={!!errors.photoAdmisiones}>
                        <InputLabel style={{ position: 'relative', transform: 'none', marginBottom: '8px' }}>
                            Foto de la persona encargada de admisiones
                        </InputLabel>
                        {photoAdmisionesPreview && (
                            <div className="mb-2 max-w-20">
                                <img src={photoAdmisionesPreview} alt="Portada" className="w-full object-contain border rounded" />
                            </div>
                        )}
                        <p className="text-blue-700">Solo se permite formato .webp y se recomienda el siguiente tamaño: </p>
                        <FileUploader
                            acceptedFileTypes={["image/*"]}
                            path={TEMP_FOLDER}
                            maxFileCount={1}
                            onUploadStart={handleUploadStart}
                            onUploadSuccess={handlePhotoAmissionSuccess}
                            onUploadError={handleUploadError}
                            showThumbnails={false}
                            processFile={({ file }) => ({ file, key: `photo-admisiones-${Date.now()}-${file.name}` })}
                        />
                        {errors.photoAdmisiones && <FormHelperText>{errors.photoAdmisiones}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth error={!!errors.audioAdmisiones}>
                        <InputLabel style={{ position: 'relative', transform: 'none', marginBottom: '8px' }}>
                            Audio mp3 de admisiones (puede ser un mensaje del encargado)
                        </InputLabel>
                        <p className="text-blue-700">Solo se permite formato .mp3</p>
                        {audioAdmisionesPreview && (
                            <div className="mb-2 w-full">
                                <audio controls className="w-full rounded border">
                                    <source src={audioAdmisionesPreview} type="audio/mpeg" />
                                    Tu navegador no soporta el audio.
                                </audio>
                            </div>
                        )}
                        <FileUploader
                            acceptedFileTypes={["audio/mpeg", ".mp3"]}
                            path={TEMP_FOLDER}
                            maxFileCount={1}
                            onUploadStart={handleUploadStart}
                            onUploadSuccess={handleAudioAdmisionesSuccess}
                            onUploadError={handleUploadError}
                            showThumbnails={false}
                            processFile={({ file }) => ({ file, key: `audio-admisiones-${Date.now()}-${file.name}` })}
                        />
                        {errors.audioAdmisiones && <FormHelperText>{errors.audioAdmisiones}</FormHelperText>}
                    </FormControl>
                </div>

                
                <h3 className="font-bold text-gray-700 mt-2 border-b">Redes e Idiomas</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                        label="Facebook"
                        value={socialFacebook}
                        onChange={(e) => setSocialFacebook(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Instagram"
                        value={socialInstagram}
                        onChange={(e) => setSocialInstagram(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Twitter"
                        value={socialTwitter}
                        onChange={(e) => setSocialTwitter(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Youtube"
                        value={socialYoutube}
                        onChange={(e) => setSocialYoutube(e.target.value)}
                        fullWidth
                    />
                </div>

                <TextField
                    label="Idiomas (separados por coma)"
                    value={languagesStr}
                    onChange={(e) => setLanguagesStr(e.target.value)}
                    fullWidth
                    helperText="Ej: Español, Inglés, Francés"
                />

                <h3 className="font-bold text-gray-700 mt-2 border-b">Redes y ubicación Embebida</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                        label="Facebook"
                        value={embedFacebook}
                        onChange={(e) => setEmbedFacebook(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Instagram"
                        value={embedInstagram}
                        onChange={(e) => setEmbedInstagram(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Google Map"
                        value={embedGoogleMap}
                        onChange={(e) => setEmbedGoogleMap(e.target.value)}
                        fullWidth
                    />
                </div>


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