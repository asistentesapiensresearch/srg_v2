import { a } from "@aws-amplify/backend";

export const Institution = a.model({
    name: a.string().required(),
    description: a.string(),
    logo: a.string(), // URL del logo
    website: a.url(),
    path: a.string(),
    isLinked: a.boolean(),

    // Información del Rector
    rectorName: a.string(),
    rectorPhoto: a.string(),
    rectorSocial: a.json(), // Ej: { linkedin: "...", x: "..." }

    // Clasificación
    type: a.string(),    // Ej: Universidad, Instituto
    subtype: a.string(), // Ej: Pública, Privada

    // Info Institucional
    socialMedia: a.json(), // Ej: { facebook: "...", instagram: "..." }
    languages: a.string().array(), // Ej: ["Español", "Inglés"]

    template: a.hasOne("Template", "institutionId"),
})
    .secondaryIndexes(index => [
        // 🔥 Importante para buscar por URL rápida
        index('path').queryField('listInstitutionByPath'),
    ])
    .authorization(allow => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['create', 'update', 'delete', 'read'])
    ]);