import { defineFunction } from '@aws-amplify/backend';

export const manageUserGroup = defineFunction({
    name: 'manage-user-group',
    entry: './handler.ts',
    // Importante: asignarla al grupo 'data' para evitar dependencias circulares si la llamas desde la API
    resourceGroupName: 'data'
});