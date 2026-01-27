// src/components/builder/helpers/renderFieldInput.jsx
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import ImageUploaderField from './ImageUploaderField';
import { ResearchEditorInptSection } from './ResearchEditorInptSection';
import CssCodeInput from '../inputs/CssCodeInput';
import BrandsListInput from '../inputs/BrandsListInput';

const renderFieldInput = (field, activeSection, onChange) => {
  const value = activeSection.props[field.name];
  // ========== SEPARATOR ==========
  if (field.type === 'separator') {
    return (
      <Box sx={{ mt: 3 }}>
        <Divider>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: '0.5px'
            }}
          >
            {field.label}
          </Typography>
        </Divider>
      </Box>
    );
  }

  // ========== TEXT ==========
  if (field.type === 'text') {
    return (
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={value || field.default || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || field.default}
          helperText={field.help}
        />
      </Box>
    );
  }

  // 
  if (field.type === 'wysiwyg') {
    return (
      <ResearchEditorInptSection
        placeholder="Descripción"
        content={value || field.default || ''}
        onChange={(e) => onChange(e)}
      />
    )
  }

  if (field.type == 'brandsList') {
    return (
      <BrandsListInput
        value={value || field.default || ''}
        onChange={(e) => onChange(e)}
      />
    )
  }

  if (field.type === 'cssCode') {
    return (
      <CssCodeInput
        field={field}
        value={value}
        onChange={onChange}
      />
    );
  }

  // ========== TEXTAREA ==========
  if (field.type === 'textarea') {
    return (
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          size="small"
          value={value || field.default || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || field.default}
          helperText={field.help}
        />
      </Box>
    );
  }

  // ========== NUMBER ==========
  if (field.type === 'number') {
    return (
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}
        </Typography>
        <TextField
          fullWidth
          type="number"
          size="small"
          value={value ?? field.default ?? 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          inputProps={{
            min: field.min,
            max: field.max,
            step: field.step || 1
          }}
          helperText={field.help}
        />
      </Box>
    );
  }

  // ========== SLIDER (alternativa para números) ==========
  if (field.type === 'slider') {
    return (
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}: {value ?? field.default}
        </Typography>
        <Slider
          value={value ?? field.default ?? 0}
          onChange={(e, newValue) => onChange(newValue)}
          min={field.min || 0}
          max={field.max || 100}
          step={field.step || 1}
          marks
          valueLabelDisplay="auto"
        />
        {field.help && (
          <Typography variant="caption" color="text.secondary">
            {field.help}
          </Typography>
        )}
      </Box>
    );
  }

  // ========== SELECT ==========
  if (field.type === 'select') {
    return (
      <FormControl fullWidth size="small">
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}
        </Typography>
        <Select
          value={value ?? field.default}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {field.help && (
          <Typography variant="caption" color="text.secondary" mt={0.5}>
            {field.help}
          </Typography>
        )}
      </FormControl>
    );
  }

  // ========== COLOR ==========
  if (field.type === 'color') {
    return (
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            type="color"
            value={value || field.default || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '50px',
              height: '38px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <TextField
            size="small"
            fullWidth
            value={value || field.default || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
          />
        </Box>
        {field.help && (
          <Typography variant="caption" color="text.secondary" mt={0.5}>
            {field.help}
          </Typography>
        )}
      </Box>
    );
  }

  // ========== SWITCH / BOOLEAN ==========
  if (field.type === 'switch' || field.type === 'boolean') {
    return (
      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={value ?? field.default ?? false}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" fontWeight={600}>
              {field.label}
            </Typography>
          }
        />
        {field.help && (
          <Typography variant="caption" color="text.secondary" display="block" ml={4}>
            {field.help}
          </Typography>
        )}
      </Box>
    );
  }

  // ========== IMAGE URL ==========
  if (field.type === 'image') {
    return (
      <Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block">
          {field.label}
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={value || field.default || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          helperText={field.help}
        />
        {value && (
          <Box
            sx={{
              mt: 1,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              maxHeight: '150px'
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // ========== IMAGE UPLOADER (AWS S3) ==========
  if (field.type === 'image_uploader') {
    return (
      <ImageUploaderField
        key={field.name}
        field={field}
        value={activeSection.props[field.name]}
        onChange={onChange}
        sectionId={activeSection.id}
      />
    );
  }

  // ========== FALLBACK ==========
  return (
    <Box>
      <Typography variant="caption" color="error">
        Tipo de campo no soportado: {field.type}
      </Typography>
    </Box>
  );
};

export default renderFieldInput;