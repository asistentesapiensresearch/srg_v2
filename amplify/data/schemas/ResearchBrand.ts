import { a } from "@aws-amplify/backend";

export const ResearchBrand = a.model({
    id: a.id(),

    researchId: a.id(),
    brandId: a.id(),

    research: a.belongsTo("Research", "researchId"),
    brand: a.belongsTo("Brand", "brandId")
})
    .secondaryIndexes(index => [
        index('researchId').queryField('listBrandByResearchId'),
        index('brandId').queryField('listBrandByBrandId'),
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);
