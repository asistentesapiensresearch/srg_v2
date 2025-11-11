import { defineStorage } from "@aws-amplify/backend";

const authorizations = (allow: any) => [
    allow.groups(["Admin"]).to(["read", "write", "delete"]),
    allow.groups(["Allies"]).to(["read", "write"]),
    allow.groups(["Viewer"]).to(["read"]),
    allow.guest.to(["read"]),
];

export const storage = defineStorage({
    name: "srgStorage",
    access: (allow) => ({
        'institutions/*': authorizations(allow),
        'research/*': authorizations(allow),
        'sections/*': authorizations(allow),
        'shared/*': authorizations(allow),
    })
});
