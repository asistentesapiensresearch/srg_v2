import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';

export type IModels = keyof typeof client.models;

const client = generateClient<Schema>();

const getClient = (type: IModels) => {
    return client.models[type];
};

const handleErrors = (errors: any, type: IModels, action: string) => {
    if (errors && errors.length) {
        console.error(`Error ${action} ${type}:`, errors);
        throw new Error(errors.map((e: any) => e.message).join('\n'));
    }
};

export const apiSyncService = {
    async get(type: IModels, limit?: number, filter?: any): any {
        try {
            const params: Record<string, any> = {};
            if (limit) params.limit = limit;
            if (filter) params.filter = filter;

            const { data, errors } = await getClient(type).list({
                ...params,
                authMode: 'apiKey'
            });
            handleErrors(errors, type, 'fetching');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in get(${type}):`, error);
            throw error;
        }
    },

    async getById(type: IModels, id: string): any {
        try {
            const { data, errors } = await getClient(type).get({ id });
            handleErrors(errors, type, 'fetching by ID');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in getById(${type}):`, error);
            throw error;
        }
    },

    async create(type: IModels, body: any): any {
        try {
            const { data, errors } = await getClient(type).create(body);
            handleErrors(errors, type, 'creating');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in create(${type}):`, error);
            throw error;
        }
    },

    async update(type: IModels, id: string, info: any): any {
        try {
            const { data, errors } = await getClient(type).update({ id, ...info });
            handleErrors(errors, type, 'updating');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in update(${type}):`, error);
            throw error;
        }
    },

    async delete(type: IModels, id: string): any {
        try {
            const { data, errors } = await getClient(type).delete({ id });
            handleErrors(errors, type, 'deleting');
            return data;
        } catch (error) {
            console.error(`[apiSyncService] Unhandled exception in delete(${type}):`, error);
            throw error;
        }
    },

    async query(type: IModels, query: string, variables: any): any {
        try {
            const result = await getClient(type)[query](variables);
            return result;
        } catch (error) {
            console.error(`Error executing query ${query} on ${type}:`, error);
            throw error;
        }
    }
};