import { a } from "@aws-amplify/backend";
import { InstitutionSubtype, InstitutionType } from "@core/domain/types";

export const Institution = a.model({
    name: a.string(),
    description: a.string(),
    icon: a.string(),
    type: a.enum(Object.values(InstitutionType)),
    subtype: a.enum(Object.values(InstitutionSubtype)),
    createdAt: a.string(),
    updatedAt: a.string(),
}).authorization((allow) => [allow.guest()]);