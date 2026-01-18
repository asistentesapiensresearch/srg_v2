import { a } from "@aws-amplify/backend";

export const Logo = a.model({
    index: a.integer(),
    name: a.string(),
    link: a.string(),
    key: a.string(),
    research: a.hasMany("ResearchLogo", "logoId")
})
    .secondaryIndexes(index => [
        index('name').queryField('listLogoByName')
    ])
    .authorization((allow) => [
        allow.publicApiKey().to(["read"]),
        allow.groups(["Admin"]).to(["create", "update", "delete", "read"]),
        allow.guest().to(["read"])
    ]);
