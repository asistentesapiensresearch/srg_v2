import { lazy, Suspense } from "react";
import { Preloader } from "../components/Preloader";

const ErrorContentNotAvailable = lazy(() => import("../pages/admin/ErrorContentNotAvailable"));
const Layout = lazy(() => import("../pages/admin/Layout"));
const Sections = lazy(() => import("../pages/admin/Sections/Sections"));
const Home = lazy(() => import('../pages/admin/Home'));

export const AdminRoutes = [
    {
        idex: true,
        element: (
            <Suspense fallback={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <Preloader />
                </div>
            }>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'sections',
                element: <Sections />
            },
            {
                path: '*',
                element: <ErrorContentNotAvailable />
            }
        ]
    },
]