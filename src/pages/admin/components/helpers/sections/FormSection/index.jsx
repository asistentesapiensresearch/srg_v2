import React, { useState, useMemo } from 'react';
import {
    Box, Container, Grid, Typography, TextField,
    Button, MenuItem, Paper, Snackbar, Alert
} from '@mui/material';
import { Send, Mail, MessageCircle } from 'lucide-react';

export default function FormSection({
    title = "Contáctanos",
    description,
    submitAction = "whatsapp", // 'whatsapp' | 'email'
    destination,
    submitButtonText = "Enviar",
    formFields = "[]"
}) {
    // 1. Parsear los campos de forma segura
    const fields = useMemo(() => {
        try {
            const parsed = typeof formFields === 'string' ? JSON.parse(formFields) : formFields;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Error parsing form fields", e);
            return [];
        }
    }, [formFields]);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ open: false, msg: '', type: 'success' });

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = "Campo obligatorio";
                isValid = false;
            }
            if (field.type === 'email' && formData[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.name])) {
                    newErrors[field.name] = "Correo inválido";
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
            setNotification({ open: true, msg: 'Corrige los errores antes de enviar', type: 'error' });
            return;
        }

        if (!destination) {
            setNotification({ open: true, msg: 'Falta configurar el destino en el editor', type: 'error' });
            return;
        }

        if (submitAction === 'whatsapp') {
            let message = `*Nuevo Contacto Web*\n------------------\n`;
            fields.forEach(field => {
                const val = formData[field.name] || 'N/A';
                message += `*${field.label}:* ${val}\n`;
            });

            const url = `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            setNotification({ open: true, msg: 'Abriendo WhatsApp...', type: 'success' });
        } else if (submitAction === 'email') {
            const subject = encodeURIComponent(`Contacto Web: ${formData.nombre || 'Nuevo Mensaje'}`);
            let body = `Detalles del formulario:\n\n`;
            fields.forEach(field => {
                body += `${field.label}: ${formData[field.name] || '-'}\n`;
            });

            window.location.href = `mailto:${destination}?subject=${subject}&body=${encodeURIComponent(body)}`;
            setNotification({ open: true, msg: 'Abriendo correo...', type: 'success' });
        }
    };

    if (fields.length === 0) return null;

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e0e0e0' }}>

                <Box textAlign="center" mb={4}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant="body1" color="text.secondary">
                            {description}
                        </Typography>
                    )}
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        {fields.map((field, index) => {
                            // Corrección de Grid para compatibilidad
                            const gridWidth = field.width || 12;
                            return (
                                <Grid item xs={12} md={gridWidth} key={index}>
                                    {renderField(field, formData, handleChange, errors)}
                                </Grid>
                            );
                        })}

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={submitAction === 'whatsapp' ? <MessageCircle size={20} /> : <Send size={18} />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: submitAction === 'whatsapp' ? '#25D366' : 'primary.main',
                                    boxShadow: submitAction === 'whatsapp' ? '0 4px 14px 0 rgba(37,211,102,0.39)' : 3,
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
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={notification.type} variant="filled" sx={{ width: '100%' }}>
                    {notification.msg}
                </Alert>
            </Snackbar>
        </Container>
    );
}

// Helper renderizado (igual que tu versión, limpio)
const renderField = (field, formData, handleChange, errors) => {
    const commonProps = {
        fullWidth: true,
        label: field.label,
        variant: "outlined",
        value: formData[field.name] || '',
        onChange: (e) => handleChange(field.name, e.target.value),
        error: !!errors[field.name],
        helperText: errors[field.name],
        required: field.required,
        size: "medium"
    };

    switch (field.type) {
        case 'textarea':
            return <TextField {...commonProps} multiline minRows={4} />;
        case 'select':
            let options = Array.isArray(field.options)
                ? field.options
                : (typeof field.options === 'string' ? field.options.split(',').map(o => o.trim()) : []);
            return (
                <TextField {...commonProps} select>
                    {options.map((opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)}
                </TextField>
            );
        case 'date':
            return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />;
        case 'number':
            return <TextField {...commonProps} type="number" />;
        case 'email':
            return <TextField {...commonProps} type="email" />;
        default:
            return <TextField {...commonProps} />;
    }
};