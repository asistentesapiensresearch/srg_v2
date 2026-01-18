import {
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Checkbox,
  Box,
  Typography
} from '@mui/material';
import RichTextEditorInpt from '@components/forms/RichTextEditor'; // Ajusta la ruta a tu WYSIWYG
import DataSourceInput from '../inputs/DataSourceInput';
import CssCodeInput from '../inputs/CssCodeInput';
import ColorInput from '../inputs/ColorInput';

/**
 * @param {Object} field - El objeto field del schema.js
 * @param {any} value - El valor actual contenido en activeSection.props[field.name]
 * @param {Function} onChange - El callback (value) => handleFieldChange(field.name, value)
 */
export default function renderFieldInput(field, value, onChange, rteRef) {
  const safeValue = value ?? (field.default || '');

  // Props base para los inputs de MUI
  const commonProps = {
    fullWidth: true,
    size: "small",
    label: field.label,
    value: safeValue,
    variant: "outlined",
    margin: "dense", // Más compacto para el sidebar
    onChange: (e) => onChange(e.target.value),
  };

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      return <TextField {...commonProps} type={field.type} />;

    case 'number':
      return (
        <TextField
          {...commonProps}
          type="number"
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );

    case 'textarea':
      return <TextField {...commonProps} multiline rows={field.rows || 4} />;

    case 'select':
      return (
        <TextField {...commonProps} select>
          {field.options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </MenuItem>
          ))}
        </TextField>
      );

    case 'color':
      return (
        <Box sx={{ mt: 1, mb: 1 }}>
          <ColorInput field={field} value={value} onChange={onChange}></ColorInput>
        </Box>
      );

    case 'cssCode':
      return (
        <Box sx={{ mt: 2, mb: 2 }}>
          <CssCodeInput field={field} value={value} onChange={onChange}></CssCodeInput>
        </Box>
      );

    case 'wysiwyg':
      return (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
            {field.label}
          </Typography>
          <RichTextEditorInpt
            content={safeValue}
            placeholder={field.default}
            rteRef={rteRef}
            onChange={(html) => onChange(html)}
          // Importante: Si tu RichTextEditorInpt no tiene un onUpdate, 
          // asegúrate de que use la ref para capturar el contenido antes de guardar.
          />
        </Box>
      );

    case 'switch':
      return (
        <FormControlLabel
          sx={{ my: 0.5 }}
          control={
            <Switch
              size="small"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={<Typography variant="body2">{field.label}</Typography>}
        />
      );

    case 'checkbox':
      return (
        <FormControlLabel
          sx={{ my: 0.5 }}
          control={
            <Checkbox
              size="small"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={<Typography variant="body2">{field.label}</Typography>}
        />
      );

    case 'data_source_manager':
      return (
        <Box sx={{ my: 2 }}>
          <Typography variant="caption" fontWeight="bold">{field.label}</Typography>
          <DataSourceInput
            value={safeValue}
            onChange={(newValue) => onChange(newValue)}
          />
        </Box>
      );

    default:
      return (
        <Typography variant="caption" color="error">
          Tipo "{field.type}" no soportado
        </Typography>
      );
  }
}