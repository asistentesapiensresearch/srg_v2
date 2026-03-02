import { lazy } from "react";
import { SuspenseLoader } from "../components/SuspenseLoader";
import Users from "@src/pages/admin/Users/Users";
import GalleryManager from "@src/pages/admin/Galleries/GalleryManager";

const ErrorContentNotAvailable = lazy(() => import("../pages/admin/ErrorContentNotAvailable"));
const Layout = lazy(() => import("../pages/admin/Layout"));
const Home = lazy(() => import('../pages/admin/Home'));
const Research = lazy(() => import("../pages/admin/Research/Research"));
const Brands = lazy(() => import("../pages/admin/Brand/Brands"));
const Institutions = lazy(() => import("../pages/admin/Intitutions/Institutions"));
const Testimonial = lazy(() => import("../pages/admin/Testimonials/TestimonialManager"));
const Builder = lazy(() => import("../pages/admin/components/builder/Editor"));

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
                path: 'institutions/:id/testimonials',
                element: <Testimonial/>,
                title: "Testimonios en instituciones"
            },
            {
                path: 'galleries', // /admin/institutions
                element: <GalleryManager />,
                title: "Galerías"
            },
            {
                path: '*', // 404 dentro del admin
                element: <ErrorContentNotAvailable />,
                title: "Página no encontrada"
            }
        ]
    },
];