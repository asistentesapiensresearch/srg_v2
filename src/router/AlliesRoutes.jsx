import { lazy } from 'react';
import { SuspenseLoader } from '../components/SuspenseLoader';

const AlliesDashboard = lazy(() => import("../pages/allies/AlliesDashboard"));
const AllyManager = lazy(() => import("../pages/allies/AllyManager"));

export const AlliesRoutes = [
    {
        index: true,
        element: (
            <SuspenseLoader>
                <AlliesDashboard />
            </SuspenseLoader>
        )
    },
    {
        path: "manage/:id",
        element: (
            <SuspenseLoader>
                <AllyManager />
            </SuspenseLoader>
        )
    }
];