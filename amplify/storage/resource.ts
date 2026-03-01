import { defineStorage } from "@aws-amplify/backend";

// Tu helper existente (lo dejamos igual para las otras carpetas)
const authorizations = (allow: any) => [
    allow.groups(["Admin"]).to(["read", "write", "delete", "list", "get"]),
    allow.groups(["Allies"]).to(["read", "write", "list", "get"]),
    allow.groups(["Viewer"]).to(["read", "list", "get"]), // Viewer aquí solo lee
    allow.guest.to(["read", "list", "get"]),
];

export const storage = defineStorage({
    name: "srgStorage",
    access: (allow) => ({
        'institutions/*': authorizations(allow),
        'research/*': authorizations(allow),
        'sections/*': authorizations(allow),
        'brands/*': authorizations(allow),
        'shared/*': authorizations(allow),
        'galleries/*': authorizations(allow),

        // 🔥 REGLA CORREGIDA PARA PERFILES
        'profiles/*': [
            // 1. Regla genérica (para usuarios sin grupo)
            allow.authenticated.to(['read', 'write', 'delete']),

            // 2. 🔥 REGLA CRÍTICA: Debemos dar permiso explícito a los GRUPOS
            // Si no pones esto, el rol del grupo 'Viewer' no podrá subir fotos.
            allow.groups(['Viewer', 'Allies', 'Admin']).to(['read', 'write', 'delete']),

            // 3. Permiso público de lectura
            allow.guest.to(['read'])
        ]
    })
});