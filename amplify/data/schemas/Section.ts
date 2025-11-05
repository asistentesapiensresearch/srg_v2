import { a } from "@aws-amplify/backend";

export const Section = a.model({
    name: a.string(),
    description: a.string(),
    icon: a.string(),
    createdAt: a.string(),
    updatedAt: a.string(),
}).authorization((allow) => [allow.guest()]);