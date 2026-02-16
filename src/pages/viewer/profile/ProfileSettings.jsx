import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Avatar,
    Grid, Alert, Snackbar
} from '@mui/material';
import { Save, Camera } from 'lucide-react';

import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Preloader } from '@src/components/preloader';

export const ProfileSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoKey, setPhotoKey] = useState(''); // Key en S3

    const [msg, setMsg] = useState({ open: false, text: '', type: 'success' });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const attr = await fetchUserAttributes();
            setName(attr.name || '');

            if (attr.picture) {
                setPhotoKey(attr.picture);
                // Obtener URL firmada para visualizar
                const url = await getUrl({ path: attr.picture });
                setPhotoUrl(url.url.toString());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Subir a S3: public/profiles/{timestamp}-name
        const path = `profiles/${Date.now()}-${file.name}`;

        try {
            setSaving(true);
            const result = await uploadData({
                path,
                data: file,
                options: {
                    accessLevel: 'guest' // O 'protected' si prefieres privacidad
                }
            }).result;

            setPhotoKey(result.path);

            // Previsualizar localmente inmediato
            const objectUrl = URL.createObjectURL(file);
            setPhotoUrl(objectUrl);

        } catch (error) {
            console.error('Error uploading:', error);
            setMsg({ open: true, text: 'Error subiendo imagen', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUserAttributes({
                userAttributes: {
                    name: name,
                    picture: photoKey // Guardamos el path de S3 en Cognito
                }
            });
            setMsg({ open: true, text: 'Perfil actualizado correctamente', type: 'success' });
        } catch (error) {
            console.error(error);
            setMsg({ open: true, text: 'Error actualizando perfil', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Preloader />;

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', maxWidth: 600 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ajustes de Perfil
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Actualiza tu información personal visible en la plataforma.
            </Typography>

            <Grid container spacing={4} alignItems="center">

                {/* FOTO */}
                <Grid size={{ sx: 12, sm: 4 }} display="flex" flexDirection="column" alignItems="center">
                    <Box position="relative">
                        <Avatar
                            src={photoUrl}
                            sx={{ width: 100, height: 100, border: '4px solid white', boxShadow: 2 }}
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="icon-button-file"
                            type="file"
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="icon-button-file">
                            <Box
                                sx={{
                                    position: 'absolute', bottom: 0, right: 0,
                                    bgcolor: 'primary.main', borderRadius: '50%', p: 0.5,
                                    cursor: 'pointer', '&:hover': { bgcolor: 'primary.dark' }
                                }}
                            >
                                <Camera size={16} color="white" />
                            </Box>
                        </label>
                    </Box>
                </Grid>

                {/* FORMULARIO */}
                <Grid size={{ sx: 12, sm: 8 }}>
                    <TextField
                        fullWidth
                        label="Nombre Completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<Save size={18} />}
                        onClick={handleSave}
                        disabled={saving}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </Grid>
            </Grid>

            <Snackbar
                open={msg.open}
                autoHideDuration={4000}
                onClose={() => setMsg({ ...msg, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={msg.type}>{msg.text}</Alert>
            </Snackbar>
        </Paper>
    );
};