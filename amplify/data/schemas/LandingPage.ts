// En tu archivo Institution.ts
import { a } from "@aws-amplify/backend";

export const LandingPage = a.model({
    title: a.string().required(),
    slug: a.string().required(), // ej: 'mi-oferta-especial'
    isPublished: a.boolean().default(false),
    // Aquí vive la magia: Un array de objetos que define el orden y contenido
    sectionsConfig: a.json(),
})
    .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        // CAMBIO AQUÍ: Agrega 'read'
        allow.groups(['Admin']).to(['create', 'update', 'delete', 'read']),

        // Esto se queda igual
        allow.guest().to(['read'])
    ]);