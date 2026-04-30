import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";

const GoogleAdForm = ({ googleAd, onClose, create, update }) => {
  const [form, setForm] = useState({
    adUnitPath: "",
    slotId: "",
    enabled: true,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (googleAd) {
      setForm({
        adUnitPath: googleAd.adUnitPath || "",
        slotId: googleAd.slotId || "",
        enabled: googleAd.enabled ?? true,
      });
    }
  }, [googleAd]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.adUnitPath.trim()) {
      newErrors.adUnitPath = "El Ad Unit Path es obligatorio";
    }

    if (!form.slotId.trim()) {
      newErrors.slotId = "El Slot ID es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        adUnitPath: form.adUnitPath.trim(),
        slotId: form.slotId.trim(),
        enabled: form.enabled,
      };

      const success = googleAd?.id
        ? await update(googleAd.id, payload)
        : await create(payload);

      if (success) onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {googleAd?.id ? "Editar anuncio" : "Crear nuevo anuncio"}
      </DialogTitle>

      <FormGroup className="p-4 flex flex-col gap-4">
        <TextField
          label="Ad Unit Path"
          placeholder="/52413523/2122"
          value={form.adUnitPath}
          onChange={(e) => handleChange("adUnitPath", e.target.value)}
          fullWidth
          required
          error={!!errors.adUnitPath}
          helperText={errors.adUnitPath}
        />

        <TextField
          label="Slot ID"
          placeholder="div-gpt-ad-1662608593804-0"
          value={form.slotId}
          onChange={(e) => handleChange("slotId", e.target.value)}
          fullWidth
          required
          error={!!errors.slotId}
          helperText={errors.slotId}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.enabled}
              onChange={(e) => handleChange("enabled", e.target.checked)}
            />
          }
          label={form.enabled ? "Activo" : "Inactivo"}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="contained" disabled={saving} onClick={handleSave}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </FormGroup>
    </Dialog>
  );
};

export default GoogleAdForm;