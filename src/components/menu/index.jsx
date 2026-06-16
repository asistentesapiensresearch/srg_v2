import { Building2, UserIcon } from "lucide-react";

export const Menu = [
    {
        path: '/',
        label: 'Inicio',
        auth: false
    },
    {
        path: '/admin',
        label: 'Admin',
        group: 'Admin',
        auth: true
    },
    {
        path: '/allies',
        label: 'Mis colegios',
        icon: <Building2 className='me-2' />,
        groups: ['Allies', 'Admin'],
        auth: true
    },
    {
        path: '/profile',
        label: 'Mi Cuenta',
        icon: <UserIcon className='me-2' />,
        auth: true
    },
]
