// En tu archivo de Section.ts
import { a } from "@aws-amplify/backend";

export const Section = a.model({
    name: a.string(),
    description: a.string(),
    color: a.string(),
    icon: a.string(),
    createdAt: a.string(),
    updatedAt: a.string(),
    Researchs: a.hasMany('Research', 'sectionId')
})
    .authorization((allow) => [
        // Solo Admin puede crear, actualizar o borrar
        allow.groups(['Admin']).to(['create', 'update', 'delete', 'read']),

        // Usuarios no autenticados (guest) también pueden leer
        allow.guest().to(['read'])
    ]);