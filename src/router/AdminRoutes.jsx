// src/router/AdminRoutes.jsx
import { lazy, Suspense } from "react";
import { Preloader } from "../components/preloader";

const ErrorContentNotAvailable = lazy(() => import("../pages/admin/ErrorContentNotAvailable"));
const Layout = lazy(() => import("../pages/admin/Layout"));
const Home = lazy(() => import('../pages/admin/Home'));
const Research = lazy(() => import("../pages/admin/Research/Research"));
const Brands = lazy(() => import("../pages/admin/Brand/Brands"));
const Builder = lazy(() => import("../pages/admin/components/builder/Editor"));

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
                path: 'research',
                children: [
                    {
                        index: true,
                        element: <Research />
                    }
                ]
            },
            {
                path: 'brands',
                element: <Brands />
            },
            {
                path: '*',
                element: <ErrorContentNotAvailable />
            }
        ]
    },
]