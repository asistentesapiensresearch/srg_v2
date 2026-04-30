import { a } from "@aws-amplify/backend";

export const GoogleAd = a.model({
    adUnitPath: a.string().required(),
    slotId: a.string().required(),
    enabled: a.boolean().default(true),
    adminEmail: a.string(),
})
.authorization(allow => [
    allow.publicApiKey().to(["read"]),
    allow.authenticated().to(["create", "update", "delete", "read"]),
    allow.ownerDefinedIn('adminEmail').identityClaim('email').to(['read', 'update']),
]);