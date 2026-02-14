// src/view/sections/DirectorySection/results/utils.js

export const getValue = (item, searchKeys) => {
    if (!item) return null;

    // Aseguramos que keys sea un array
    const keys = Array.isArray(searchKeys) ? searchKeys : [searchKeys];

    // ---------------------------------------------------------
    // 1. INTENTO RÁPIDO (Directo)
    // ---------------------------------------------------------
    // Esto soluciona tu problema con el console.log.
    // Al intentar leer item[key], activamos el Proxy si existe.
    for (const key of keys) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
            return item[key];
        }
    }

    // ---------------------------------------------------------
    // 2. INTENTO PROFUNDO (Insensible a mayúsculas)
    // ---------------------------------------------------------
    // Solo si el acceso directo falló, iteramos las llaves.
    // Convertimos a objeto plano para asegurar que Object.keys funcione
    // incluso si es un Proxy extraño.
    const plainItemKeys = Object.keys(item);

    for (const key of keys) {
        const lowerKey = String(key).toLowerCase();

        // Buscamos coincidencia exacta de texto (ignorando mayúsculas)
        const exactMatch = plainItemKeys.find(k => k.toLowerCase() === lowerKey);
        if (exactMatch) return item[exactMatch];

        // Buscamos coincidencia parcial (includes)
        // Nota: Esto puede ser peligroso (ej: buscar "ID" y encontrar "idea"), 
        // úsalo solo si es necesario.
        const partialMatch = plainItemKeys.find(k => k.toLowerCase().includes(lowerKey));
        if (partialMatch) return item[partialMatch];
    }

    return null;
};