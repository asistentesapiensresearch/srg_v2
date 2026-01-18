// src/components/builder/sectionRegistry.js

// Carga todos los index.jsx y schema.js dentro de las subcarpetas de /sections
const modules = import.meta.glob('./sections/*/*.jsx', { eager: true });
const schemas = import.meta.glob('./sections/*/*.js', { eager: true });

export const SECTION_REGISTRY = {};
export const SECTION_SCHEMAS = {};

for (const path in modules) {
    // Extrae el nombre de la carpeta (ej: /sections/HeroSection/index.jsx -> HeroSection)
    const name = path.split('/')[2];

    SECTION_REGISTRY[name] = modules[path].default;
}

for (const path in schemas) {
    // Busca archivos que no sean index.jsx (asumiendo config.js o schema.js)
    if (path.includes('schema.js')) {
        const name = path.split('/')[2];
        SECTION_SCHEMAS[name] = schemas[path].default;
    }
}