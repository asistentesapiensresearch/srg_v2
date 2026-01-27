// amplify/data/schemas/Template.ts
import { a } from "@aws-amplify/backend";

export const Template = a.model({
    themeSettings: a.json(),
    researchId: a.id(),
    research: a.belongsTo("Research", "researchId"),
    brands: a.hasMany("TemplateBrand", "templateId"),
})
    .secondaryIndexes(index => [
        index('researchId').queryField('listTemplateByResearchId')
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.groups(['Admin']).to(['create', 'update', 'delete', 'read']),
        allow.guest().to(['read'])
    ]);