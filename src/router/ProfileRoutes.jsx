import { lazy } from "react";
import { SuspenseLoader } from "../components/SuspenseLoader";

const MyInstitutions = lazy(() => import("../pages/viewer/profile/MyInstitutions").then(m => ({ default: m.MyInstitutions })));
const ProfileLayout = lazy(() => import("../pages/viewer/profile/ProfileLayout").then(m => ({ default: m.ProfileLayout })));
const ProfileSettings = lazy(() => import("../pages/viewer/profile/ProfileSettings").then(m => ({ default: m.ProfileSettings })));
const AllyManager = lazy(() => import("../pages/allies/AllyManager")); // Reutilizamos el Manager

export const ProfileRoutes = [
    {
        path: "", // Ruta base para /admin
        element: (
            <SuspenseLoader>
                <ProfileLayout />
            </SuspenseLoader>
        ),
        children: [
            {
                index: true, // /profile -> Ajustes
                element: (
                    <SuspenseLoader>
                        <ProfileSettings />
                    </SuspenseLoader>
                )
            },
            // Rutas de Aliados (Anidadas en Profile)
            {
                path: 'institutions',
                element: (
                    // Protegemos esta sub-ruta solo para Aliados/Admin
                    <SuspenseLoader>
                        <MyInstitutions />
                    </SuspenseLoader>
                ),
                title: "Mis instituciones"
            },
            {
                path: 'institutions/manage/:id',
                element: (
                    <SuspenseLoader>
                        <AllyManager />
                    </SuspenseLoader>
                )
            }
        ]
    }
];