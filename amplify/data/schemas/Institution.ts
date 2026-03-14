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

    // Admisiones lo cambio a json
    admisiones: a.json(), // Ej: { mail, location, phone, link, name, photo }
    admisionesEmail: a.string(),  // temporalmente estos campos - deben eliminarse
    admisionesLink: a.url(), // temporalmente estos campos
    admisionesLabel: a.string(), // temporalmente estos campos

    // Clasificación
    type: a.string(),    // Ej: Universidad, Instituto
    subtype: a.string(), // Ej: Pública, Privada

    // Info Institucional
    socialMedia: a.json(), // Ej: { facebook: "...", instagram: "..." }
    embed: a.json(), // Ej: { googleMap: "...", facebook: "..." }
    languages: a.string().array(), // Ej: ["Español", "Inglés"]

    template: a.hasOne("Template", "institutionId"),
    testimonials: a.hasMany("Testimonial", "institutionId"),
    adminEmail: a.string(),
})
    .secondaryIndexes(index => [
        // 🔥 Importante para buscar por URL rápida
        index('path').queryField('listInstitutionByPath'),
        index('adminEmail').queryField('listInstitutionsByAdmin'),
    ])
    .authorization(allow => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['create', 'update', 'delete', 'read']),
        allow.ownerDefinedIn('adminEmail').identityClaim('email').to(['read', 'update']),
    ]);