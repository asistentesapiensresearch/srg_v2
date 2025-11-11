import { a } from "@aws-amplify/backend";

export const Research = a.model({
    title: a.string(),
    description: a.string(),
    dateRange: a.string(),
    dataSourceId: a.string(),
    sectionId: a.id(),
    section: a.belongsTo('Section', 'sectionId') // Asume que tienes un modelo 'Section'
})
    .authorization((allow) => [
        // CAMBIO AQUÍ: Agrega 'read'
        allow.groups(['Admin']).to(['create', 'update', 'delete', 'read']),

        // Esto se queda igual
        allow.guest().to(['read'])
    ]);