import { a } from "@aws-amplify/backend";

export const ResearchLogo = a.model({
    id: a.id(),

    researchId: a.id(),
    logoId: a.id(),

    research: a.belongsTo("Research", "researchId"),
    logo: a.belongsTo("Logo", "logoId")
})
    .secondaryIndexes(index => [
        index('researchId').queryField('listLogoByResearchId'),
        index('logoId').queryField('listLogoByLogoId'),
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);
