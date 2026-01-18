import { UserIcon } from "lucide-react";

export const Menu = [
    {
        path: '/',
        label: 'Inicio',
        auth: false
    },
    {
        path: '/about',
        label: 'Nosotros',
        auth: false
    },
    {
        path: '/allies',
        label: 'Aliados',
        group: 'Allies',
        auth: true
    },
    {
        path: '/admin',
        label: 'Admin',
        group: 'Admin',
        auth: true
    },
    {
        path: '/profile',
        label: 'Perfil',
        icon: <UserIcon className='me-2' />,
        auth: true
    },
]