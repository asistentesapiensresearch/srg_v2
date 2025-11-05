import { a } from "@aws-amplify/backend";

export const Research = a.schema({
    Research: a.model({
        title: a.string(),
        description: a.string(),
        dateRange: a.string(),
        dataSourceId: a.string(),
        sectionId: a.id(),
        section: a.belongsTo('Section','sectionId'),
    }).authorization((allow) => [allow.guest()]),
});