import React, { useState, useEffect } from 'react';
import {
    Box, Button, Card, CardContent, Grid, IconButton, TextField,
    Typography, Select, MenuItem, FormControl, InputLabel,
    Switch, FormControlLabel, Divider, Tooltip, Alert
} from '@mui/material';
import {
    Plus, Trash2, GripVertical, Type, Hash, Mail,
    AlignLeft, Calendar, List
} from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Tipos de campos disponibles para el usuario
const FIELD_TYPES = [
    { type: 'text', label: 'Texto Corto', icon: <Type size={16} /> },
    { type: 'textarea', label: 'Texto Largo', icon: <AlignLeft size={16} /> },
    { type: 'email', label: 'Correo Electrónico', icon: <Mail size={16} /> },
    { type: 'number', label: 'Número / Teléfono', icon: <Hash size={16} /> },
    { type: 'select', label: 'Lista Desplegable', icon: <List size={16} /> },
    { type: 'date', label: 'Fecha', icon: <Calendar size={16} /> },
];

// Componente de Ítem Ordenable (Campo individual)
const SortableFieldItem = ({ field, index, onChange, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <Card ref={setNodeRef} style={style} sx={{ mb: 2, border: '1px solid #e0e0e0', position: 'relative' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Grid container spacing={2} alignItems="center">

                    {/* Drag Handle */}
                    <Grid item xs={1} sx={{ cursor: 'grab', display: 'flex', justifyContent: 'center' }} {...attributes} {...listeners}>
                        <GripVertical color="#9e9e9e" />
                    </Grid>

                    {/* Configuración del Campo */}
                    <Grid item xs={11}>
                        <Grid container spacing={2}>
                            {/* Nombre del Campo (Label) */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Nombre del Campo (Etiqueta)"
                                    value={field.label}
                                    onChange={(e) => onChange(index, 'label', e.target.value)}
                                    fullWidth
                                    size="small"
                                    placeholder="Ej: Nombre Completo"
                                />
                            </Grid>

                            {/* Tipo de Campo */}
                            <Grid item xs={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={field.type}
                                        label="Tipo"
                                        onChange={(e) => onChange(index, 'type', e.target.value)}
                                    >
                                        {FIELD_TYPES.map(t => (
                                            <MenuItem key={t.type} value={t.type} sx={{ gap: 1 }}>
                                                {t.icon} {t.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Ancho (Mitad o Completo) */}
                            <Grid item xs={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Ancho</InputLabel>
                                    <Select
                                        value={field.width}
                                        label="Ancho"
                                        onChange={(e) => onChange(index, 'width', e.target.value)}
                                    >
                                        <MenuItem value={12}>Completo (100%)</MenuItem>
                                        <MenuItem value={6}>Mitad (50%)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Obligatorio Switch */}
                            <Grid item xs={6} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={field.required}
                                            onChange={(e) => onChange(index, 'required', e.target.checked)}
                                            size="small"
                                        />
                                    }
                                    label={<Typography variant="caption">Obligatorio</Typography>}
                                />
                            </Grid>

                            {/* Eliminar */}
                            <Grid item xs={6} md={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => onDelete(index)} color="error" size="small">
                                    <Trash2 size={18} />
                                </IconButton>
                            </Grid>

                            {/* Opciones extra para Select */}
                            {field.type === 'select' && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Opciones (separadas por coma)"
                                        value={field.options}
                                        onChange={(e) => onChange(index, 'options', e.target.value)}
                                        fullWidth
                                        size="small"
                                        helperText="Ej: Opción A, Opción B, Opción C"
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// Componente Principal del Builder
export default function FormBuilder({ value, onChange }) {
    // Parseamos el JSON inicial o iniciamos vacío
    const [fields, setFields] = useState(() => {
        try {
            const parsed = typeof value === 'string' ? JSON.parse(value) : value;
            // Aseguramos que cada campo tenga un ID único para el Drag & Drop
            return Array.isArray(parsed) ? parsed.map(f => ({ ...f, id: f.id || Math.random().toString(36).substr(2, 9) })) : [];
        } catch {
            return [];
        }
    });

    // Cada vez que 'fields' cambia, actualizamos el padre con el JSON string
    useEffect(() => {
        const cleanFields = fields.map(({ id, ...rest }) => rest); // Quitamos el ID interno antes de guardar
        onChange(JSON.stringify(cleanFields));
    }, [fields, onChange]);

    const handleAddField = () => {
        const newField = {
            id: Math.random().toString(36).substr(2, 9),
            label: 'Nuevo Campo',
            name: `campo_${Date.now()}`, // Nombre interno automático
            type: 'text',
            width: 12,
            required: false,
            options: ''
        };
        setFields([...fields, newField]);
    };

    const handleChangeField = (index, key, val) => {
        const updated = [...fields];
        updated[index][key] = val;

        // Si cambia el label, actualizamos el 'name' técnico automáticamente (opcional)
        if (key === 'label') {
            updated[index].name = val.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, "_");
        }

        setFields(updated);
    };

    const handleDeleteField = (index) => {
        if (confirm('¿Eliminar este campo?')) {
            const updated = [...fields];
            updated.splice(index, 1);
            setFields(updated);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                Constructor de Formulario
            </Typography>

            {fields.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    El formulario está vacío. Añade campos para comenzar.
                </Alert>
            )}

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                    {fields.map((field, index) => (
                        <SortableFieldItem
                            key={field.id}
                            field={field}
                            index={index}
                            onChange={handleChangeField}
                            onDelete={handleDeleteField}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <Button
                variant="outlined"
                startIcon={<Plus size={18} />}
                onClick={handleAddField}
                fullWidth
                sx={{ mt: 1, borderStyle: 'dashed', textTransform: 'none' }}
            >
                Añadir Campo
            </Button>
        </Box>
    );
}