import {
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Toolbar,
    Tooltip
} from "@mui/material";
import { Briefcase, Building2Icon, ChevronDown, LayoutDashboard, MessageSquareTextIcon, Settings, UsersIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Sidebar = ({
    drawerWidth = 260,
    miniDrawerWidth = 80,
    theme,
    open
}) => {
    const [itemsOpen, setItemsOpen] = useState([]);
    const Menu = [
        {
            label: 'Secciones',
            items: [
                {
                    path: 'sections',
                    label: 'Lista secciones',
                    icon: <LayoutDashboard size={20} />,
                },
                {
                    path: 'research',
                    label: 'Investigación',
                    icon: <LayoutDashboard size={20} />,
                },
                {
                    path: 'logos',
                    label: 'Logos',
                    icon: <LayoutDashboard size={20} />,
                }
            ]
        },
        {
            label: 'Instituciones',
            items: [
                {
                    path: 'institutions',
                    label: 'Lista instituciones',
                    icon: <Building2Icon size={20} />
                }
            ]
        },
        {
            label: 'Usuarios',
            items: [
                {
                    path: 'users',
                    label: 'Lista usuarios',
                    icon: <UsersIcon size={20} />,
                },
                {
                    path: 'comments',
                    label: 'Comentarios',
                    icon: <MessageSquareTextIcon size={20} />
                }
            ]
        },
        {
            label: 'Otros',
            items: [
                {
                    label: 'Configuración',
                    icon: <Settings size={20} />,
                    subItems: [
                        {
                            path: 'account',
                            label: 'Cuenta',
                            icon: <Briefcase size={18} />
                        }
                    ]
                }
            ]
        }
    ];

    // Estilos para el Drawer (Sidebar)
    const drawerStyles = {
        width: open ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        // Transición suave para el ancho
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        // Estilos del contenedor de papel dentro del Drawer
        '& .MuiDrawer-paper': {
            width: 'inherit', // Hereda el ancho dinámico
            overflowX: 'hidden', // Oculta el texto al colapsar
            transition: 'inherit',
            borderRight: 'none', // Sin borde
            borderRadius: '0 16px 16px 0', // Bordes redondeados
            boxShadow: 'none', // Sombra sutil
            backgroundColor: '#ffffff',
        },
    };

    // Estilos reutilizables para los botones de la lista
    const listItemButtonStyles = {
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
        borderRadius: '12px', // Bordes redondeados en los items
        margin: '4px 8px', // Espaciado
        '&:hover': {
            backgroundColor: theme.palette.action.hover
        }
    };

    const handleOpen = (label) => {
        if (!itemsOpen.includes(label)) {
            setItemsOpen(prev => [...prev, label]);
        } else {
            setItemsOpen(prev => prev.filter(p => p !== label))
        }
    }

    const drawItem = (item) => (
        <div key={item.label}>
            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton sx={listItemButtonStyles} onClick={() => handleOpen(item.label)}>
                    <Link className="flex items-center" to={item.path ? `./${item.path}` : '#'}>
                        <ListItemIcon sx={listItemIconStyles}>
                            <Tooltip title={item.label}>
                                {item.icon}
                            </Tooltip>
                        </ListItemIcon>
                        { open && <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }} /> }
                    </Link>

                    {/* Ícono de flecha (solo visible si el drawer está abierto) */}
                    {item.subItems && (
                        <ChevronDown
                            size={18}
                            style={{
                                transition: 'transform 0.2s',
                                transform: item.open ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    )}
                </ListItemButton>
            </ListItem>
            {/* Contenido Colapsable (Sub-menú) */}
            {item.subItems && <Collapse in={itemsOpen.includes(item.label)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {item.subItems.map((subItem) => drawItem(subItem))}
                </List>
            </Collapse>}
        </div>
    )

    // Estilos reutilizables para los íconos de la lista
    const listItemIconStyles = {
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
    };

    return (
        <Drawer variant="permanent" open={open} sx={drawerStyles}>

            {/* Espaciador para alinear con AppBar */}
            <Toolbar />

            {/* Lista de Navegación */}
            {Menu.map(item => (
                <List
                    key={item.label}
                    sx={{ p: 1 }}
                    subheader={open && <ListSubheader component="div" id="nested-list-subheader">{item.label}</ListSubheader>}
                >
                    {/* Item: Dashboard */}
                    {item.items.map(item => drawItem(item))}
                </List>
            ))}
        </Drawer>
    );
}