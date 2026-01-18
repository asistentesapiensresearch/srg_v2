// src/view/sections/DirectorySection/filters/FilterDrawer.jsx
import {
    Drawer, Box, Typography, IconButton, Accordion,
    AccordionSummary, AccordionDetails, FormGroup,
    FormControlLabel, Checkbox, Button, Divider,
    TextField
} from "@mui/material";
import { X, ChevronDown, FilterX } from "lucide-react";
import { useState } from "react";

export const FilterDrawer = ({
    open,
    onClose,
    availableFilters, // Objeto: { "Ciudad": ["Bogota", "Cali"], "Categoria": [...] }
    activeFilters,    // Objeto: { "Ciudad": ["Bogota"] }
    onFilterChange,   // Función para actualizar
    onClearAll
}) => {

    const [availableFiltersFiltered, setAvailableFiltersFiltered] = useState(availableFilters);

    // Maneja el cambio de un checkbox individual
    const handleCheckboxChange = (column, value) => {
        const currentSelected = activeFilters[column] || [];
        let newSelected;

        if (currentSelected.includes(value)) {
            // Si ya está, lo quitamos
            newSelected = currentSelected.filter(item => item !== value);
        } else {
            // Si no está, lo agregamos
            newSelected = [...currentSelected, value];
        }

        onFilterChange(column, newSelected);
    };

    const changeFilter = ({ target },columnName) => {
        const { value } = target;
        const newValues = availableFilters[columnName].filter(i => {
            const normalized = i.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase();
            return normalized.includes(value.toLowerCase());
        })
        setAvailableFiltersFiltered(filters => ({
            ...filters,
            [columnName]: newValues
        }))
    }

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            // keepMounted: false ayuda a liberar memoria al cerrar, 
            // pero true ayuda a que abra rápido la SEGUNDA vez. 
            // Para tu caso, mejor optimizamos el contenido interno.
            PaperProps={{
                sx: { width: { xs: '100%', sm: 320 }, p: 0 }
            }}
        >
            {/* CABECERA DEL DRAWER */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" fontWeight="bold">Filtros</Typography>
                <IconButton onClick={onClose}><X size={20} /></IconButton>
            </Box>

            <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>

                {Object.keys(availableFiltersFiltered).map((columnName) => (
                    <Accordion
                        key={columnName}
                        disableGutters
                        elevation={0}
                        // ⭐ TRUCO DE ORO: Esto evita que se rendericen los 500 checkboxes
                        // al abrir el drawer. Solo se crean cuando das click en el acordeón.
                        TransitionProps={{ unmountOnExit: true }}
                        sx={{
                            border: '1px solid #eee',
                            borderRadius: 2,
                            mb: 1,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {columnName}
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ maxHeight: 300, overflowY: 'auto' }}>
                            <FormGroup>
                                {/* OPTIMIZACIÓN OPCIONAL: 
                                   Si una lista tiene más de 100 items, renderizarlos todos bloquea.
                                   Podrías poner un .slice(0, 50) si son demasiados.
                                */}
                                <TextField
                                    label="Buscar..."
                                    id={`search-${columnName}`}
                                    onChange={(event) => changeFilter(event, columnName)}
                                    size="small"
                                />
                                {availableFiltersFiltered[columnName].map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        control={
                                            <Checkbox
                                                checked={activeFilters[columnName]?.includes(option) || false}
                                                onChange={() => handleCheckboxChange(columnName, option)}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">{option}</Typography>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* FOOTER DEL DRAWER */}
            <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<FilterX size={16} />}
                    onClick={onClearAll}
                >
                    Limpiar todos los filtros
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={onClose}
                >
                    Ver resultados
                </Button>
            </Box>
        </Drawer>
    );
};