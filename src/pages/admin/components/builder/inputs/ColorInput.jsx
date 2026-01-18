import { Box, TextField, Typography } from "@mui/material";

export default function ColorInput({ field, value, commonProps, onChange }) {
    const safeValue = value ?? (field.default || '');
    return (
        <>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                {field.label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                    type="color"
                    value={safeValue}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ width: '35px', height: '35px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                />
                <TextField {...commonProps} label="" margin="none" sx={{ flex: 1 }} />
            </Box>
        </>
    )
}