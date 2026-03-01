import { CircularProgress, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

// 🔥 NUEVO COMPONENTE INTERNO
export default function AsyncSelectInput({ field, value, onChange }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchOptions = async () => {
            setLoading(true);
            try {
                if (typeof field.loadOptions === 'function') {
                    const data = await field.loadOptions();
                    if (isMounted) setOptions(data || []);
                }
            } catch (error) {
                console.error(`Error cargando opciones para ${field.name}:`, error);
                if (isMounted) setOptions([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchOptions();
        return () => { isMounted = false; };
    }, [field]);

    return (
        <FormControl fullWidth size="small" sx={{ position: 'relative' }
        }>
            <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5} display="block" >
                {field.label}
            </Typography>
            <Select
                value={value ?? field.default ?? ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={loading || options.length === 0}
                displayEmpty
            >
                {/* Placeholder mientras carga o si no hay opciones */}
                <MenuItem value="" disabled >
                    {loading ? "Cargando opciones..." : (options.length === 0 ? "No hay opciones disponibles" : "Seleccione una opción")}
                </MenuItem>

                {/* Renderizar opciones cargadas */}
                {
                    options.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value} >
                            {opt.label}
                        </MenuItem>
                    ))
                }
            </Select>

            {/* Iconito de carga flotante */}
            {
                loading && (
                    <CircularProgress size={16} sx={{ position: 'absolute', top: 32, right: 30 }
                    } />
                )
            }
            {
                field.help && (
                    <Typography variant="caption" color="text.secondary" mt={0.5} >
                        {field.help}
                    </Typography>
                )
            }
        </FormControl>
    );
};