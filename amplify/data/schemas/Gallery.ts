import { a } from "@aws-amplify/backend";

export const Gallery = a.model({
    name: a.string().required(),
    description: a.string(),
    type: a.string(), // 'Institution', 'Research', 'Event', 'General'
    entityId: a.string(), // ID opcional para vincularlo a una institución específica

    // Guardaremos las imágenes como un JSON array para no sobrecargar de tablas
    // Estructura: [{ original: "path/s3", thumbnail: "path/s3", description: "" }]
    images: a.json().required(),
})
    .authorization(allow => [
        allow.publicApiKey().to(['read']),
        allow.groups(["Admin", "Allies"]).to(['create', 'read', 'update', 'delete'])
    ]);
