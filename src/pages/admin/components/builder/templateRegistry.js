// src/components/builder/templateRegistry.js

// Carga todos los schema.js dentro de las subcarpetas de /templates
const schemas = import.meta.glob('../helpers/templates/*/*.js', { eager: true });

export const TEMPLATE_REGISTRY = {};

for (const path in schemas) {
    // Busca archivos que no sean index.jsx (asumiendo config.js o schema.js)
    if (path.includes('schema.js')) {
        const paths = path.split('/');
        const name = paths[paths.length-2];
        TEMPLATE_REGISTRY[name] = schemas[path].default;
    }
}