import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';

export default function DebouncedInput({
    value,
    onChange,
    delay = 300,
    ...props
}) {
    const [localValue, setLocalValue] = useState(value ?? '');
    const timeoutRef = useRef(null);

    useEffect(() => {
        setLocalValue(value ?? '');
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            onChange(newValue);
        }, delay);
    };

    return (
        <TextField
            {...props}
            value={localValue}
            onChange={handleChange}
        />
    );
}