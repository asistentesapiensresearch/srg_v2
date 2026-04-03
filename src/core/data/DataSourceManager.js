import { generateClient } from 'aws-amplify/data';

const client = generateClient();

class DataSourceManager {

    static cache = {};
    
    static getCacheKey(type, params) {
        return `${type}:${JSON.stringify(params)}`;
    }

    // Métodos para buscar en la BD usando Amplify DataStore
    static async findByField(modelName, searchField, searchValue, limit = 1) {

        const key = this.getCacheKey("db-field", { modelName, searchField, searchValue, limit });
        if (this.cache[key]) {
            return this.cache[key];
        }

        const promise =  client.models[modelName].list({
            filter: { [searchField]: { eq: searchValue } },
            limit
        });


        this.cache[key] = promise;

        return promise;
    }

}

export default DataSourceManager;