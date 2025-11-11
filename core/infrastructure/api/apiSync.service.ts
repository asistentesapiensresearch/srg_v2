import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';

type IModels = 'Institution' | 'Research' | 'Section';

const client = generateClient<Schema>();

const getClient = (type: IModels) => {
    return client.models[type];
};

// Helper para manejar errores de Amplify
const handleErrors = (errors: any, type: IModels, action: string) => {
    if (errors && errors.length) {
        console.error(`Error ${action} ${type}:`, errors);
        throw new Error(errors.map((e: any) => e.message).join('\n'));
    }
};

export const apiSyncService = {
    async get(type: IModels, limit?: number, filter?: any) {
        try {
            const params: Record<string, any> = {};
            if (limit) params.limit = limit;
            if (filter) params.filter = filter;

            const { data, errors } = await getClient(type).list(params);
            handleErrors(errors, type, 'fetching');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in get(${type}):`, error);
            throw error;
        }
    },

    async create(type: IModels, body: any) {
        try {
            const { data, errors } = await getClient(type).create(body);
            handleErrors(errors, type, 'creating');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in create(${type}):`, error);
            throw error;
        }
    },

    async update(type: IModels, id: string, info: any) {
        try {
            const { data, errors } = await getClient(type).update({ id, ...info });
            handleErrors(errors, type, 'updating');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in update(${type}):`, error);
            throw error;
        }
    },

    async delete(type: IModels, id: string) {
        try {
            const { data, errors } = await getClient(type).delete({ id });
            handleErrors(errors, type, 'deleting');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in delete(${type}):`, error);
            throw error;
        }
    },
};