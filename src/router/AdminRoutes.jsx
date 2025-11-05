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
            }
        ]
    }
]