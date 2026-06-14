import { lazy } from "react";
import { SuspenseLoader } from "../components/SuspenseLoader";

const ErrorContentNotAvailable = lazy(() => import("../pages/admin/ErrorContentNotAvailable"));
const Layout = lazy(() => import("../pages/admin/Layout"));
const Home = lazy(() => import('../pages/admin/Home'));
const Research = lazy(() => import("../pages/admin/Research/Research"));
const Brands = lazy(() => import("../pages/admin/Brand/Brands"));
const Ads = lazy(() => import("../pages/admin/Ads/Ads"));
const Institutions = lazy(() => import("../pages/admin/Intitutions/Institutions"));
const Articles = lazy(() => import("../pages/admin/Articles/Articles"));
const Pages = lazy(() => import("../pages/admin/Pages/Pages"));
const Testimonial = lazy(() => import("../pages/admin/Testimonials/TestimonialManager"));
const Builder = lazy(() => import("../pages/admin/components/builder/Editor"));
const Users = lazy(() => import("../pages/admin/Users/Users"));
const GalleryManager = lazy(() => import("../pages/admin/Galleries/GalleryManager"));
const MigrationDashboard = lazy(() => import("../pages/admin/migration/MigrationDashboard"));

export const AdminRoutes = [
    // 1. Ruta del Builder (Sin Layout General, ocupa toda la pantalla)
    {
        path: ':type/:id',
        element: (
            <SuspenseLoader>
                <Builder />
            </SuspenseLoader>
        )
    },
    // 2. Rutas con Layout Administrativo
    {
        path: "", // Ruta base para /admin
        element: (
            <SuspenseLoader>
                <Layout />
            </SuspenseLoader>
        ),
        children: [
            {
                index: true, // /admin
                element: <Home />
            },
            {
                path: 'research', // /admin/research
                children: [
                    {
                        index: true,
                        element: <Research />,
                        title: "Investigaciones"
                    }
                ]
            },
            {
                path: 'brands', // /admin/brands
                element: <Brands />,
                title: "Marcas"
            },
            {
                path: 'users', // /admin/brands
                element: <Users />,
                title: "Usuarios"
            },
            {
                path: 'institutions', // /admin/institutions
                element: <Institutions />,
                title: "Instituciones"
            },
            {
                path: 'ads', // /admin/institutions
                element: <Ads />,
                title: "Anuncios"
            },
            {
                path: 'articles', // /admin/institutions
                element: <Articles />,
                title: "Artículos"
            },
            {
                path: 'pages', // /admin/institutions
                element: <Pages />,
                title: "Páginas"
            },
            {
                path: 'institutions/:id/testimonials',
                element: <Testimonial/>,
                title: "Testimonios en instituciones"
            },
            {
                path: 'galleries',
                element: <GalleryManager />,
                title: "Galerías"
            },
            {
                path: 'migration/articles',
                element: <MigrationDashboard type="article" />,
                title: "Migración de artículos"
            },
            {
                path: 'migration/pages',
                element: <MigrationDashboard type="page" />,
                title: "Migración de páginas"
            },
            {
                path: '*', // 404 dentro del admin
                element: <ErrorContentNotAvailable />,
                title: "Página no encontrada"
            }
        ]
    },
];