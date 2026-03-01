// amplify/data/schemas/Template.ts
import { a } from "@aws-amplify/backend";

export const Testimonial = a.model({
    name: a.string().required(),     // Nombre de quien da el testimonio
    role: a.string(),                // (Opcional) Ej: Exalumno, Padre de familia
    content: a.string().required(),
    photo: a.string(),

    institutionId: a.id(),
    institution: a.belongsTo("Institution", "institutionId"),
})
    .secondaryIndexes(index => [
        index('name').queryField('listTestimonialByName'),
        index('institutionId').queryField('listTestimonialByInstitutionId'),
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.groups(['Admin']).to(['create', 'update', 'delete', 'read']),
        allow.guest().to(['read'])
    ]);