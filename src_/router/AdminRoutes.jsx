import { lazy, Suspense } from "react";
import { Preloader } from "../components/Preloader";

const ErrorContentNotAvailable = lazy(() => import("../pages/admin/ErrorContentNotAvailable"));
const Layout = lazy(() => import("../pages/admin/Layout"));
const Home = lazy(() => import('../pages/admin/Home'));
const Sections = lazy(() => import("../pages/admin/Sections/Sections"));
const Research = lazy(() => import("../pages/admin/Research/Research"));
const Logos = lazy(() => import("../pages/admin/Logo/Logos"));
const Builder = lazy(() => import("../components/builder/Editor"));

export const AdminRoutes = [
    {
        path: 'research/:id',
        element: <Suspense fallback={
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Preloader />
            </div>
        }>
            <Builder />
        </Suspense>
    },
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
                path: 'research',
                children: [
                    {
                        index: true,
                        element: <Research />
                    }
                ]
            },
            {
                path: 'logos',
                element: <Logos />
            },
            {
                path: '*',
                element: <ErrorContentNotAvailable />
            }
        ]
    },
]