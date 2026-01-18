import { defineStorage } from "@aws-amplify/backend";

const authorizations = (allow: any) => [
    allow.groups(["Admin"]).to(["read", "write", "delete", "list", "get"]),
    allow.groups(["Allies"]).to(["read", "write", "list", "get"]),
    allow.groups(["Viewer"]).to(["read", "list", "get"]),
    allow.guest.to(["read", "list", "get"]),
];

export const storage = defineStorage({
    name: "srgStorage",
    access: (allow) => ({
        'institutions/*': authorizations(allow),
        'research/*': authorizations(allow),
        'sections/*': authorizations(allow),
        'logos/*': authorizations(allow),
        'shared/*': authorizations(allow),
    })
});
