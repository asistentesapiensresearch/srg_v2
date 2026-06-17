import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Alert,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Save,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
  Languages,
  Image as ImageIcon,
  Building2,
  Camera,
  Mail,
  Phone,
  Video,
  MoreVertical,
  ChevronDown,
  MessageCircle,
  Info,
  Heart,
  Edit2,
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

const createSafeUploadProcessor =
  (prefix) =>
  ({ file }) => ({
    file,
    key: `${prefix}-${Date.now()}.${getSafeExtension(file.name)}`,
  });

const normalizeOptionalUrl = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    throw new Error(`La URL "${value}" no es válida.`);
  }
};

const cardSx = {
  borderRadius: "20px",
  border: "1px solid #e8edf2",
  boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
  bgcolor: "#fff",
};

const iconButtonSx = (active = false) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(15, 23, 42, 0.14)",
  bgcolor: active ? "#0f172a" : "#fff",
  color: active ? "#fff" : "#475569",
  minWidth: 0,
  p: 0,
  boxShadow: "none",
  "&:hover": { bgcolor: active ? "#0f172a" : "#f1f5f9", boxShadow: "none" },
});

const SectionTitle = ({ children }) => (
  <Typography
    variant="caption"
    sx={{
      fontWeight: 700,
      color: "#94a3b8",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      display: "block",
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);

const StatCard = ({ label, value, icon }) => (
  <Paper
    elevation={0}
    sx={{
      ...cardSx,
      p: 2.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}
      >
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "12px",
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#475569",
      }}
    >
      {icon}
    </Box>
  </Paper>
);

export const AllyInstitutionForm = ({
  institution,
  onCancel,
  onSaveSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [languagesStr, setLanguagesStr] = useState("");

  const [rectorName, setRectorName] = useState("");
  const [rectorLinkedin, setRectorLinkedin] = useState("");

  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");

  const [logoKey, setLogoKey] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [portadaKey, setPortadaKey] = useState("");
  const [portadaPreview, setPortadaPreview] = useState("");
  const [rectorKey, setRectorKey] = useState("");
  const [rectorPreview, setRectorPreview] = useState("");

  useEffect(() => {
    if (institution) {
      setName(institution.name || "");
      setSlogan(institution.slogan || "");
      setDescription(institution.description || "");
      setWebsite(institution.website || "");
      setRectorName(institution.rectorName || "");
      const langs = Array.isArray(institution.languages)
        ? institution.languages.join(", ")
        : "";
      setLanguagesStr(langs);
      try {
        const rSocial =
          typeof institution.rectorSocial === "string"
            ? JSON.parse(institution.rectorSocial)
            : institution.rectorSocial || {};
        setRectorLinkedin(rSocial.linkedin || "");
        const iSocial =
          typeof institution.socialMedia === "string"
            ? JSON.parse(institution.socialMedia)
            : institution.socialMedia || {};
        setSocialFacebook(iSocial.facebook || "");
        setSocialInstagram(iSocial.instagram || "");
        setSocialLinkedin(iSocial.linkedin || "");
      } catch (e) {
        console.error(e);
      }
      if (institution.logo) {
        setLogoKey(institution.logo);
        getUrl({ path: institution.logo }).then((res) =>
          setLogoPreview(res.url.toString()),
        );
      }
      if (institution.portadaPhoto) {
        setPortadaKey(institution.portadaPhoto);
        getUrl({ path: institution.portadaPhoto }).then((res) =>
          setPortadaPreview(res.url.toString()),
        );
      }
      if (institution.rectorPhoto) {
        setRectorKey(institution.rectorPhoto);
        getUrl({ path: institution.rectorPhoto }).then((res) =>
          setRectorPreview(res.url.toString()),
        );
      }
    }
  }, [institution]);

  const handleUploadSuccess = async (key, type) => {
    const res = await getUrl({ path: key });
    if (type === "logo") {
      setLogoKey(key);
      setLogoPreview(res.url.toString());
    } else if (type === "portada") {
      setPortadaKey(key);
      setPortadaPreview(res.url.toString());
    } else {
      setRectorKey(key);
      setRectorPreview(res.url.toString());
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let finalLogoKey = logoKey;
      if (logoKey && logoKey.includes(TEMP_FOLDER)) {
        finalLogoKey = await moveIconToDefinitiveFolder(
          TEMP_FOLDER,
          logoKey,
          `logo-${Date.now()}`,
        );
        if (institution.logo && institution.logo !== finalLogoKey)
          await remove({ path: institution.logo }).catch(() => {});
      }
      let finalPortadaKey = portadaKey;
      if (portadaKey && portadaKey.includes(TEMP_FOLDER)) {
        finalPortadaKey = await moveIconToDefinitiveFolder(
          TEMP_FOLDER,
          portadaKey,
          `portada-${Date.now()}`,
        );
        if (
          institution.portadaPhoto &&
          institution.portadaPhoto !== finalPortadaKey
        )
          await remove({ path: institution.portadaPhoto }).catch(() => {});
      }
      let finalRectorKey = rectorKey;
      if (rectorKey && rectorKey.includes(TEMP_FOLDER)) {
        finalRectorKey = await moveIconToDefinitiveFolder(
          TEMP_FOLDER,
          rectorKey,
          `rector-${Date.now()}`,
        );
        if (
          institution.rectorPhoto &&
          institution.rectorPhoto !== finalRectorKey
        )
          await remove({ path: institution.rectorPhoto }).catch(() => {});
      }
      const rectorSocialPayload = JSON.stringify({
        linkedin: rectorLinkedin.trim(),
      });
      const socialMediaPayload = JSON.stringify({
        facebook: socialFacebook.trim(),
        instagram: socialInstagram.trim(),
        linkedin: socialLinkedin.trim(),
      });
      const languagesArray = languagesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const normalizedWebsite = normalizeOptionalUrl(website);
      const normalizedName = name.trim();
      if (!normalizedName)
        throw new Error("El nombre de la institución es obligatorio.");
      const { data: updatedInstitution, errors } =
        await client.models.Institution.update(
          {
            id: institution.id,
            name: normalizedName,
            slogan: slogan.trim(),
            description: description.trim(),
            website: normalizedWebsite,
            logo: finalLogoKey,
            portadaPhoto: finalPortadaKey,
            rectorName: rectorName.trim(),
            rectorPhoto: finalRectorKey,
            rectorSocial: rectorSocialPayload,
            socialMedia: socialMediaPayload,
            languages: languagesArray,
          },
          { authMode: "userPool" },
        );
      if (errors?.length)
        throw new Error(errors.map((i) => i.message).join("\n"));
      if (!updatedInstitution?.id)
        throw new Error("No se pudo confirmar la actualización.");
      const { data: persistedInstitution, errors: fetchErrors } =
        await client.models.Institution.get(
          { id: institution.id },
          { authMode: "userPool" },
        );
      if (fetchErrors?.length)
        throw new Error(fetchErrors.map((i) => i.message).join("\n"));
      const savedInstitution = persistedInstitution || updatedInstitution;
      if ((savedInstitution.slogan || "") !== slogan.trim())
        throw new Error(
          "El backend no devolvió el slogan actualizado. Intenta guardar nuevamente.",
        );
      setSuccess("Información actualizada correctamente.");
      await onSaveSuccess?.(savedInstitution);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: "#f8fafc",
      fontSize: "0.875rem",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": {
        borderColor: "#0f172a",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": { fontSize: "0.875rem", color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0f172a" },
  };

  return (
    <Box sx={{ bgcolor: "#f1f5f9", minHeight: "100vh", p: { xs: 2, md: 3 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "14px" }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "14px" }}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" },
          gap: 2.5,
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* ══════════════════════════════════════
                    COLUMNA IZQUIERDA — Perfil de institución
                ══════════════════════════════════════ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Tarjeta de perfil principal */}
          <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={logoPreview}
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "#ffc453",
                  border: "3px solid #fff",
                  boxShadow: "0 0 0 2px #e2e8f0",
                  mx: "auto",
                }}
              >
                <Building2 size={36} />
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #fff",
                  cursor: "pointer",
                }}
              >
                <Edit2 size={12} color="#fff" />
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {name || institution?.name || "Institución"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              {institution?.subtype ||
                institution?.type ||
                "Institución educativa"}
            </Typography>

            {/* Redes de contacto */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                <Mail size={16} />
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                <Phone size={16} />
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                <MessageCircle size={16} />
              </Box>
            </Box>

            <Divider sx={{ mb: 2, borderColor: "#f1f5f9" }} />

            {/* Stats rápidos */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
                mb: 2.5,
              }}
            >
              {[
                { label: "Programas", value: "—" },
                { label: "Aliados", value: "—" },
              ].map((s) => (
                <Box
                  key={s.label}
                  sx={{
                    bgcolor: "#f8fafc",
                    borderRadius: "12px",
                    p: 1.5,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1 }}
                  >
                    {s.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#94a3b8", fontWeight: 600 }}
                  >
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Acciones */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                startIcon={
                  loading ? <Preloader size={16} /> : <Save size={16} />
                }
                fullWidth
                sx={{
                  borderRadius: "12px",
                  py: 1.2,
                  bgcolor: "#0f172a",
                  boxShadow: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  "&:hover": { bgcolor: "#1e293b", boxShadow: "none" },
                }}
              >
                Guardar cambios
              </Button>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  py: 1.2,
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>

          {/* Rectoría */}
          <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <SectionTitle>Rectoría</SectionTitle>
              <Button sx={iconButtonSx(false)}>
                <MoreVertical size={16} />
              </Button>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Avatar
                src={rectorPreview}
                sx={{ width: 52, height: 52, bgcolor: "#ffd166" }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {rectorName || "Nombre del rector"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Rector(a)
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                p: 1.5,
                mb: 2,
              }}
            >
              <FileUploader
                acceptedFileTypes={["image/*"]}
                path={TEMP_FOLDER}
                maxFileCount={1}
                showThumbnails={false}
                processFile={createSafeUploadProcessor("rector")}
                onUploadSuccess={({ key }) =>
                  handleUploadSuccess(key, "rector")
                }
                displayText={{
                  dropFilesToUpload: "Soltar foto",
                  browseFiles: "Buscar",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                label="Nombre completo"
                fullWidth
                value={rectorName}
                onChange={(e) => setRectorName(e.target.value)}
                size="small"
                sx={fieldSx}
              />
              <TextField
                label="LinkedIn"
                fullWidth
                value={rectorLinkedin}
                onChange={(e) => setRectorLinkedin(e.target.value)}
                size="small"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Linkedin size={15} color="#0A66C2" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* ══════════════════════════════════════
                    COLUMNA CENTRAL — Contenido principal
                ══════════════════════════════════════ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Header del micrositio — cards de imágenes */}
          <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: "#0f172a" }}
                >
                  Header del micrositio
                </Typography>
                <Button sx={iconButtonSx(false)}>
                  <ChevronDown size={18} />
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button sx={iconButtonSx(false)}>
                  <Camera size={17} />
                </Button>
                <Button sx={iconButtonSx(false)}>
                  <ImageIcon size={17} />
                </Button>
                <Button sx={iconButtonSx(false)}>
                  <Heart size={17} />
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 2,
              }}
            >
              {/* Logo */}
              <Box sx={{ borderRadius: "16px", p: 2.5, bgcolor: "#fffbeb" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#92400e",
                      bgcolor: "#fef3c7",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                    }}
                  >
                    Logo
                  </Typography>
                  <Button
                    sx={{ ...iconButtonSx(false), width: 32, height: 32 }}
                  >
                    <MoreVertical size={16} />
                  </Button>
                </Box>
                <Box
                  sx={{
                    height: 90,
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.7)",
                    border: "1px dashed #fcd34d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    overflow: "hidden",
                  }}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      style={{
                        maxHeight: 72,
                        maxWidth: "85%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Building2 size={28} color="#fbbf24" />
                  )}
                </Box>
                <FileUploader
                  acceptedFileTypes={["image/*"]}
                  path={TEMP_FOLDER}
                  maxFileCount={1}
                  showThumbnails={false}
                  processFile={createSafeUploadProcessor("logo")}
                  onUploadSuccess={({ key }) =>
                    handleUploadSuccess(key, "logo")
                  }
                  displayText={{
                    dropFilesToUpload: "Soltar logo",
                    browseFiles: "Buscar",
                  }}
                />
              </Box>
              {/* Portada */}
              <Box sx={{ borderRadius: "16px", p: 2.5, bgcolor: "#eff6ff" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#1e40af",
                      bgcolor: "#dbeafe",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                    }}
                  >
                    Portada
                  </Typography>
                  <Button
                    sx={{ ...iconButtonSx(false), width: 32, height: 32 }}
                  >
                    <MoreVertical size={16} />
                  </Button>
                </Box>
                <Box
                  sx={{
                    height: 90,
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.7)",
                    border: "1px dashed #93c5fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                    overflow: "hidden",
                  }}
                >
                  {portadaPreview ? (
                    <img
                      src={portadaPreview}
                      alt="Portada"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <ImageIcon size={28} color="#60a5fa" />
                  )}
                </Box>
                <FileUploader
                  acceptedFileTypes={["image/*"]}
                  path={TEMP_FOLDER}
                  maxFileCount={1}
                  showThumbnails={false}
                  processFile={createSafeUploadProcessor("portada")}
                  onUploadSuccess={({ key }) =>
                    handleUploadSuccess(key, "portada")
                  }
                  displayText={{
                    dropFilesToUpload: "Soltar imagen",
                    browseFiles: "Buscar",
                  }}
                />
              </Box>
              {/* Slogan */}
              <Box sx={{ borderRadius: "16px", p: 2.5, bgcolor: "#fff1f2" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#9f1239",
                      bgcolor: "#ffe4e6",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                    }}
                  >
                    Slogan
                  </Typography>
                  <Button
                    sx={{ ...iconButtonSx(false), width: 32, height: 32 }}
                  >
                    <Info size={16} />
                  </Button>
                </Box>
                <TextField
                  multiline
                  rows={5}
                  fullWidth
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="Formamos líderes con visión global..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.65)",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      "& fieldset": { borderColor: "#fecdd3" },
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Información detallada */}
          <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#0f172a", mb: 2.5 }}
            >
              Información detallada
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Nombre de la institución"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Building2 size={15} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Sitio web oficial"
                fullWidth
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.colegio.edu.co"
                size="small"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Globe size={15} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Idiomas"
                fullWidth
                value={languagesStr}
                onChange={(e) => setLanguagesStr(e.target.value)}
                placeholder="Español, Inglés"
                size="small"
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Languages size={15} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Tipo de institución"
                fullWidth
                value={institution?.subtype || institution?.type || ""}
                size="small"
                sx={fieldSx}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Building2 size={15} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Perfil institucional"
                fullWidth
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente la institución..."
                sx={{ ...fieldSx, gridColumn: { sm: "span 2" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
                      <Info size={15} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* ══════════════════════════════════════
                    COLUMNA DERECHA — Redes sociales + stats
                ══════════════════════════════════════ */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Stats rápidos tipo dashboard */}
          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
          >
          </Box>

          {/* Redes sociales */}
          <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#0f172a" }}
              >
                Redes sociales
              </Typography>
              <Button sx={iconButtonSx(false)}>
                <MessageCircle size={16} />
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Facebook */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: "#1877F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    shrink: 0,
                    flexShrink: 0,
                  }}
                >
                  <Facebook size={18} color="#fff" />
                </Box>
                <TextField
                  label="Facebook"
                  fullWidth
                  value={socialFacebook}
                  onChange={(e) => setSocialFacebook(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
              </Box>
              {/* Instagram */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Instagram size={18} color="#fff" />
                </Box>
                <TextField
                  label="Instagram"
                  fullWidth
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
              </Box>
              {/* LinkedIn */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: "#0A66C2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Linkedin size={18} color="#fff" />
                </Box>
                <TextField
                  label="LinkedIn"
                  fullWidth
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
