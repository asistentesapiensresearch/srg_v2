import Layout from "../pages/admin/Layout";
import Home from "../pages/admin/Home";

export const AdminRoutes = [
    {
        path: '',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '*',
                element: <>Error 404</>
            }
        ]
    },
]