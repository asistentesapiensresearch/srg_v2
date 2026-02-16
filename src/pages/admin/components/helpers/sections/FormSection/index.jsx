import React, { useState, useMemo } from 'react';
import {
    Box, Container, Grid, Typography, TextField,
    Button, MenuItem, Paper, Snackbar, Alert, InputAdornment
} from '@mui/material';
import { Send, Mail, MessageCircle, User, Phone, Calendar } from 'lucide-react';

export default function FormSection({
    title = "Contáctanos",
    description,
    submitAction = "whatsapp",
    destination,
    submitButtonText = "Enviar",
    formFields = "[]"
}) {
    // Parseo seguro del JSON que viene del Builder
    const fields = useMemo(() => {
        try {
            const parsed = typeof formFields === 'string' ? JSON.parse(formFields) : formFields;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Error parsing fields", e);
            return [];
        }
    }, [formFields]);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ open: false, msg: '', type: 'success' });

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = "Este campo es obligatorio";
                isValid = false;
            }
            if (field.type === 'email' && formData[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.name])) {
                    newErrors[field.name] = "Ingresa un correo válido";
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            setNotification({ open: true, msg: 'Por favor completa los campos requeridos.', type: 'error' });
            return;
        }

        if (!destination) {
            setNotification({ open: true, msg: 'Error de configuración: No hay destino definido.', type: 'error' });
            return;
        }

        // Lógica de Envío (WhatsApp / Email)
        if (submitAction === 'whatsapp') {
            let message = `*Hola, vengo de su sitio web.*\n\n`;
            fields.forEach(field => {
                const val = formData[field.name] || 'No especificado';
                message += `🔹 *${field.label}:* ${val}\n`;
            });

            const url = `https://wa.me/${destination.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        } else {
            const subject = encodeURIComponent(`Nuevo Contacto Web: ${formData.nombre || ''}`);
            let body = `Detalles del contacto:\n\n`;
            fields.forEach(field => {
                body += `${field.label}: ${formData[field.name] || '-'}\n`;
            });
            window.location.href = `mailto:${destination}?subject=${subject}&body=${encodeURIComponent(body)}`;
        }

        setNotification({ open: true, msg: '¡Redirigiendo a la aplicación de mensajería!', type: 'success' });
    };

    if (!fields || fields.length === 0) return null;

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, border: '1px solid #eee', bgcolor: '#fff' }}>

                <Box textAlign="center" mb={5}>
                    <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto' }}>
                            {description}
                        </Typography>
                    )}
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        {fields.map((field, index) => (
                            <Grid item xs={12} md={field.width || 12} key={index}>
                                <FieldRenderer
                                    field={field}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    error={errors[field.name]}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={submitAction === 'whatsapp' ? <MessageCircle /> : <Send />}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    bgcolor: submitAction === 'whatsapp' ? '#25D366' : 'primary.main',
                                    '&:hover': {
                                        bgcolor: submitAction === 'whatsapp' ? '#128C7E' : 'primary.dark',
                                    }
                                }}
                            >
                                {submitButtonText}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.type} sx={{ width: '100%' }}>
                    {notification.msg}
                </Alert>
            </Snackbar>
        </Container>
    );
}

// Subcomponente para renderizar cada input limpio
const FieldRenderer = ({ field, value, onChange, error }) => {
    const commonProps = {
        fullWidth: true,
        label: field.label + (field.required ? ' *' : ''),
        variant: "outlined",
        value: value || '',
        onChange: (e) => onChange(field.name, e.target.value),
        error: !!error,
        helperText: error,
        required: field.required
    };

    if (field.type === 'textarea') return <TextField {...commonProps} multiline rows={4} />;

    if (field.type === 'select') {
        const opts = field.options ? field.options.split(',').map(s => s.trim()) : [];
        return (
            <TextField {...commonProps} select>
                {opts.map((opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)}
            </TextField>
        );
    }

    // Inputs con íconos automáticos según el tipo
    let InputProps = {};
    if (field.type === 'email') InputProps.startAdornment = <InputAdornment position="start"><Mail size={18} color="#94a3b8" /></InputAdornment>;
    if (field.type === 'number') InputProps.startAdornment = <InputAdornment position="start"><Phone size={18} color="#94a3b8" /></InputAdornment>;
    if (field.name.includes('nombre')) InputProps.startAdornment = <InputAdornment position="start"><User size={18} color="#94a3b8" /></InputAdornment>;

    return (
        <TextField
            {...commonProps}
            type={field.type === 'number' ? 'tel' : field.type}
            InputProps={InputProps}
        />
    );
};