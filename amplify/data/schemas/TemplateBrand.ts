import { a } from "@aws-amplify/backend";

export const TemplateBrand = a.model({
    id: a.id(),

    templateId: a.id(),
    brandId: a.id(),

    template: a.belongsTo("Template", "templateId"),
    brand: a.belongsTo("Brand", "brandId")
})
    .secondaryIndexes(index => [
        index('templateId').queryField('listBrandByTemplateId'),
        index('brandId').queryField('listBrandTemplateByBrandId'),
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);
