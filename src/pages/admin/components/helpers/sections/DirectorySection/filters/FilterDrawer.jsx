import {
    Drawer, Box, Typography, IconButton, Accordion,
    AccordionSummary, AccordionDetails, FormGroup,
    FormControlLabel, Checkbox, Button, TextField, Stack
} from "@mui/material";
import { X, ChevronDown, FilterX } from "lucide-react";
import { useEffect, useState } from "react";

export const FilterDrawer = ({
    open,
    onClose,
    availableFilters, // Estructura: { tech_name: { label: "Alias", values: [] } }
    activeFilters,    
    onFilterChange,   
    onClearAll,
    quickFilters
}) => {
    // Estado local para manejar los resultados filtrados por la caja de búsqueda interna
    const [localFilters, setLocalFilters] = useState({});

    // Sincronizar estado local cuando cambian los filtros disponibles
    useEffect(() => {
        setLocalFilters(availableFilters);
    }, [availableFilters]);

    useEffect(() => {
        if(!quickFilters || Object.keys(quickFilters).length == 0){
            onClearAll();
        }
        Object.keys(quickFilters || {}).map(filter => {
            if(typeof quickFilters[filter] === 'object'){
                quickFilters[filter].map(value => {
                    handleCheckboxChange(filter, value)
                })
            } else {
                handleCheckboxChange(filter, quickFilters[filter])
            }
        })
    },[quickFilters]);

    const handleCheckboxChange = (column, value) => {
        console.log(column,value)
        const currentSelected = activeFilters[column] || [];
        const newSelected = currentSelected.includes(value)
            ? currentSelected.filter(item => item !== value)
            : [...currentSelected, value];

        onFilterChange(column, newSelected);
    };

    // Lógica de búsqueda interna por cada acordeón
    const changeFilter = ({ target }, columnName) => {
        const { value } = target;
        
        // Buscamos en los valores originales (availableFilters)
        const originalValues = availableFilters[columnName]?.values || [];
        
        const filteredValues = originalValues.filter(i => {
            const normalized = String(i).normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return normalized.includes(value.toLowerCase());
        });

        // Actualizamos solo los valores de esa columna en el estado local
        setLocalFilters(prev => ({
            ...prev,
            [columnName]: {
                ...prev[columnName],
                values: filteredValues
            }
        }));
    };

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 320 }, p: 0 } }}
        >
            {/* CABECERA */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" fontWeight="bold">Filtros</Typography>
                <IconButton onClick={onClose}><X size={20} /></IconButton>
            </Box>

            {/* CUERPO DE FILTROS */}
            <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
                {Object.entries(localFilters).map(([techName, data]) => (
                    <Accordion
                        key={techName}
                        disableGutters
                        elevation={0}
                        TransitionProps={{ unmountOnExit: true }}
                        sx={{
                            border: '1px solid #eee',
                            borderRadius: 2,
                            mb: 1,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {data.label} {/* 🔥 AQUÍ SE MUESTRA EL ALIAS */}
                                </Typography>
                                {activeFilters[techName]?.length > 0 && (
                                    <Typography variant="caption" sx={{ bgcolor: 'primary.main', color: 'white', px: 0.8, borderRadius: 10 }}>
                                        {activeFilters[techName].length}
                                    </Typography>
                                )}
                            </Stack>
                        </AccordionSummary>

                        <AccordionDetails sx={{ maxHeight: 350, overflowY: 'auto' }}>
                            <FormGroup>
                                {/* Buscador interno para listas largas */}
                                <TextField
                                    fullWidth
                                    placeholder={`Buscar en ${data.label.toLowerCase()}...`}
                                    onChange={(e) => changeFilter(e, techName)}
                                    size="small"
                                    variant="filled"
                                    sx={{ mb: 1, '& .MuiInputBase-root': { bgcolor: '#f5f5f5', borderRadius: 1 } }}
                                />
                                
                                {data.values.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        control={
                                            <Checkbox
                                                checked={activeFilters[techName]?.includes(option) || false}
                                                onChange={() => handleCheckboxChange(techName, option)}
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="body2">{option}</Typography>}
                                    />
                                ))}
                                
                                {data.values.length === 0 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                        No hay coincidencias
                                    </Typography>
                                )}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* FOOTER */}
            <Box sx={{ p: 2, borderTop: '1px solid #eee', bgcolor: 'white' }}>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<FilterX size={16} />}
                    onClick={onClearAll}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Limpiar todos los filtros
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 1, borderRadius: 2, textTransform: 'none' }}
                    onClick={onClose}
                >
                    Aplicar filtros
                </Button>
            </Box>
        </Drawer>
    );
};