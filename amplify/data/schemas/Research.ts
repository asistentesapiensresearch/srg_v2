import { a } from "@aws-amplify/backend";

export const Research = a.model({
    index: a.integer(),
    title: a.string(),
    description: a.string(),
    dateRange: a.string(),
    path: a.string(),
    icon: a.string(),
    category: a.string(),
    subCategory: a.string(),
    template: a.hasOne("Template", "researchId"),
    brands: a.hasMany("ResearchBrand", "researchId"),
    version: a.integer().default(1)
})
    .secondaryIndexes(index => [
        index('path').queryField('listResearchByPath'),
        index('dateRange').queryField('listResearchByDateRange'),
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);
