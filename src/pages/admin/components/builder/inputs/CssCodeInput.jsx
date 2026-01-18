import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { Box, Typography } from '@mui/material';

export default function CssCodeInput({ field, value, onChange }) {

    const safeValue = value ?? (field.default || '');

    return (
        <>
            {/* Label estilo MUI */}
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
                {field.label}
            </Typography>

            <Box sx={{
                border: '1px solid #c4c4c4',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': { borderColor: 'black' }, // Efecto hover similar a MUI
                '&:focus-within': { borderColor: '#1976d2', borderWidth: 2 } // Efecto focus similar a MUI
            }}>
                <CodeMirror
                    value={safeValue}
                    height="200px"
                    extensions={[css()]} // Habilita la sintaxis CSS
                    onChange={(val) => onChange(val)}
                    theme="light" // Puedes cambiar a 'dark' si instalas un tema oscuro
                    basicSetup={{
                        lineNumbers: true,
                        autocompletion: true, // Sugiere propiedades CSS
                        foldGutter: true,
                        indentOnInput: true,  // IDENTACIÓN AUTOMÁTICA
                        tabSize: 2,
                    }}
                />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                Usa <code>&</code> para referenciar al contenedor principal.
            </Typography>
        </>
    )
}