import { a } from "@aws-amplify/backend";

export const Research = a.model({
    index: a.integer().default(0),
    title: a.string(),
    description: a.string(),
    path: a.string(),
    icon: a.string(),
    category: a.string(),
    subCategory: a.string(),
    // Nuevo campo para la relación jerárquica
    parentId: a.string(),
    template: a.hasOne("Template", "researchId"),
    version: a.integer().default(1)
})
    .secondaryIndexes(index => [
        index('path').queryField('listResearchByPath'),
        // Índice opcional para buscar rápidamente indicadores de un padre
        index('parentId').queryField('listIndicatorsByParent'),
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);