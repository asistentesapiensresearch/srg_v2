import { generateClient } from 'aws-amplify/data';

const client = generateClient();

class DataSourceManager {

    static cache = {};

    static getCacheKey(type, params) {
        return `${type}:${JSON.stringify(params)}`;
    }

    static async findByField(modelName, searchField, searchValue) {
        const key = this.getCacheKey("db-field", { modelName, searchField, searchValue });
        if (this.cache[key]) {
            return this.cache[key];
        }

        // 1. Capitalizar correctamente según la convención de Amplify Gen 2
        // Ejemplo: modelName = "Institution" -> "Institution"
        // Ejemplo: searchField = "dane" -> "Dane"
        const capitalizedModel = modelName.charAt(0).toUpperCase() + modelName.slice(1);
        const capitalizedField = searchField.charAt(0).toUpperCase() + searchField.slice(1);

        // Construir el nombre del QueryField esperado en el GSI
        const queryMethodName = `list${capitalizedModel}By${capitalizedField}`; // Ej: listInstitutionByDane

        let promise;

        // 2. Validar dinámicamente si el método del índice existe en el cliente de Amplify
        if (
            client.models[modelName] &&
            typeof client.models[modelName][queryMethodName] === 'function'
        ) {
            // 🔥 ¡Estrategia Óptima (Query)! El índice existe en el esquema.
            // Se ejecuta de manera directa y eficiente sin límites de escaneo de 1MB.
            promise = client.models[modelName][queryMethodName]({
                [searchField]: searchValue
            });
        } else {
            // ⚠️ Estrategia de Respaldo (Scan). El índice NO existe en el esquema.
            // Mantiene la compatibilidad con campos/tablas no indexados todavía.
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[DataSourceManager] GSI "${queryMethodName}" no encontrado en el modelo "${modelName}". ` +
                    `Ejecutando fallback con 'list' (Scan con filtro). Considera agregar el índice en tu esquema.`
                );
            }

            promise = client.models[modelName].list({
                filter: { [searchField]: { eq: searchValue } },
            });
        }

        this.cache[key] = promise;
        return promise;
    }
}

export default DataSourceManager;