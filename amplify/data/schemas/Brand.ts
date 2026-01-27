import { a } from "@aws-amplify/backend";

export const Brand = a.model({
    index: a.integer().default(0),
    name: a.string(),
    link: a.string(),
    key: a.string(),
    research: a.hasMany("ResearchBrand", "brandId"),
    template: a.hasMany("TemplateBrand", "brandId"),
})
    .secondaryIndexes(index => [
        index('name').queryField('listBrandByName')
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);
