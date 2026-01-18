// src/components/builder/helpers/renderFieldInput.jsx
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

const updateSectionProps = (id, fieldName, value, setSections) => {
    setSections(prev => prev.map(sect =>
        sect.id === id ? { ...sect, props: { ...sect.props, [fieldName]: value } } : sect
    ));
};

export default function renderFieldInput(field, activeSection, setSections) {
    const { props } = activeSection;
    const value = props[field.name] || props[`align_${field.name}`];
    const onChange = (e) => updateSectionProps(activeSection.id, field.name, e.target.value, setSections);

    if (field.type === 'textarea') {
        return (
            <TextField
                label={field.label}
                fullWidth
                multiline
                rows={4}
                value={value}
                onChange={onChange}
            />
        );
    }

    if (field.type === 'color') {
        return (
            <Box>
                <Typography variant="caption" color="textSecondary" > {field.label} </Typography>
                < div style={{ display: 'flex', gap: '10px', alignItems: 'center' }
                }>
                    <input
                        type="color"
                        value={value}
                        onChange={onChange}
                        style={{ height: '40px', width: '40px', cursor: 'pointer', border: '1px solid #ccc', padding: 0 }}
                    />
                    < TextField
                        size="small"
                        value={value}
                        onChange={onChange}
                        fullWidth
                    />
                </div>
            </Box>
        );
    }

    if (field.type === 'select') {
        // Pequeño extra por si quieres selects en el futuro (ej: alineación)
        return (
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{field.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value || field.options[0]?.value}
                    label={field.label}
                    onChange={onChange}
                >
                    {
                        field.options?.map((option) => (
                            <MenuItem value={option.value}>{option.label}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            // <TextField
            //     select
            //     defaultValue={value || field.options[0]?.value}
            //     label={field.label}
            //     onChange={onChange}
            //     fullWidth
            // >
            //     {
            //         field.options?.map((option) => (
            //             <option key={option.value} value={option.value} >
            //                 {option.label}
            //             </option>
            //         ))
            //     }
            // </TextField>
        )
    }

    // Default: Text, Number
    return (
        <TextField
            label={field.label}
            fullWidth
            type={field.type === 'number' ? 'number' : 'text'}
            value={value}
            slotProps={{ htmlInput: { min: field.min, max: field.max } }}
            onChange={onChange}
        />
    );
};