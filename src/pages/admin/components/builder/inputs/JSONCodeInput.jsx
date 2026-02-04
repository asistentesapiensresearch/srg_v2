// src/components/builder/inputs/JSONCodeInput.jsx
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript'; // <--- Instalar o importar esto
import { Box, Typography } from '@mui/material';

export default function JSONCodeInput({ field, value, onChange, isJavascript = false }) {
    const safeValue = value ?? field?.default ?? '';

    return (
        <>
            {field && <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}
            >
                {field.label}
            </Typography>}

            <Box
                sx={{
                    border: '1px solid #c4c4c4',
                    borderRadius: 1,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'black' },
                    '&:focus-within': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                    },
                }}
            >
                <CodeMirror
                    value={safeValue}
                    height="400px" // Un poco más alto para ver mejor el código
                    // Si es JS usamos javascript(), si no json()
                    extensions={[isJavascript ? javascript({ jsx: true }) : json()]}
                    onChange={(val) => onChange(val)}
                    theme="light"
                    editable={!isJavascript} // Opcional: hacerlo readonly si es exportación
                />
            </Box>

            <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontSize: '0.7rem' }}
            >
                {isJavascript
                    ? "Formato JavaScript Template (Listo para copiar)."
                    : "Formato JSON válido (sin comentarios)."}
            </Typography>
        </>
    );
}