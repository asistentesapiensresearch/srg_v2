import React, { useEffect, useState } from 'react';
import {
    Box, Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Menu, MenuItem,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, OutlinedInput, Stack
} from '@mui/material';
import {
    MoreVertical, Shield, ShieldOff, Users as UsersIcon,
    CheckCircle, XCircle, Search, Trash2
} from 'lucide-react';

import { generateClient } from 'aws-amplify/data';
import { Preloader } from '@src/components/preloader';

const client = generateClient();

// Lista de grupos disponibles en tu sistema
const AVAILABLE_GROUPS = ['Admin', 'Allies', 'Editors', 'Viewers'];

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Estado para el Modal de Grupos
    const [openGroupModal, setOpenGroupModal] = useState(false);
    const [userGroups, setUserGroups] = useState([]); // Grupos actuales del usuario seleccionado
    const [groupLoading, setGroupLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Llamamos a tu query listCognitoUsers
            const response = await client.queries.listCognitoUsers();
            // Parseamos si viene como string JSON, si no, úsalo directo
            const parsedUsers = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            setUsers(parsedUsers || []);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- MANEJO DEL MENÚ DE ACCIONES ---
    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    // --- ACCIÓN: BLOQUEAR / DESBLOQUEAR ---
    const toggleUserStatus = async () => {
        if (!selectedUser) return;
        const isEnabled = selectedUser.Enabled;
        const action = isEnabled ? 'disable' : 'enable';

        if (!window.confirm(`¿Seguro que deseas ${isEnabled ? 'bloquear' : 'activar'} a este usuario?`)) return;

        try {
            await client.mutations.manageUserMutation({
                username: selectedUser.username,
                action: action
            });

            // Actualizar UI localmente
            setUsers(prev => prev.map(u =>
                u.Username === selectedUser.Username ? { ...u, Enabled: !isEnabled } : u
            ));
            handleMenuClose();
        } catch (error) {
            console.error("Error cambiando estado:", error);
            alert("Error al cambiar el estado del usuario.");
        }
    };

    // --- ACCIÓN: GESTIONAR GRUPOS ---
    const openGroupsDialog = () => {
        // En un escenario real, aquí deberías llamar a una función backend 
        // que liste los grupos DEL USUARIO (AdminListGroupsForUser).
        // Por simplicidad, simularemos que empezamos vacíos o asumimos los que sepamos.
        // NOTA: Cognito ListUsers estándar NO devuelve los grupos. 
        // Idealmente, necesitas crear una query 'listUserGroups' en el backend.

        setUserGroups([]); // Aquí deberías cargar los grupos reales del usuario
        setOpenGroupModal(true);
        handleMenuClose();
    };

    const handleManageGroup = async (group, action) => {
        setGroupLoading(true);
        try {
            await client.mutations.manageUserMutation({
                username: selectedUser.Username,
                groupName: group,
                action: action // 'add' o 'remove'
            });

            if (action === 'add') {
                setUserGroups(prev => [...prev, group]);
            } else {
                setUserGroups(prev => prev.filter(g => g !== group));
            }
        } catch (error) {
            console.error(`Error ${action} grupo:`, error);
            alert(`No se pudo ${action === 'add' ? 'agregar al' : 'quitar del'} grupo.`);
        } finally {
            setGroupLoading(false);
        }
    };

    if (loading) return <Box className="flex h-screen items-center justify-center"><Preloader /></Box>;

    return (
        <Container maxWidth="xl" className="py-8">
            <Box className="flex justify-between items-center mb-6">
                <div>
                    <Typography variant="h5" fontWeight="bold">Usuarios Registrados</Typography>
                    <Typography variant="body2" color="text.secondary">Gestión de accesos y roles de Cognito</Typography>
                </div>
                <Button variant="outlined" startIcon={<Search size={18} />} onClick={fetchUsers}>
                    Refrescar
                </Button>
            </Box>

            <Paper elevation={0} className="border border-gray-200 rounded-xl overflow-hidden">
                <TableContainer>
                    <Table>
                        <TableHead className="bg-gray-50">
                            <TableRow>
                                <TableCell>Usuario / Email</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Creado</TableCell>
                                <TableCell>Última Modificación</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, idx) => {
                                return (
                                    <TableRow key={idx} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{user.email || 'Sin Email'}</Typography>
                                                <Typography variant="caption" color="text.secondary">{user.Username}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={user.enabled ? <CheckCircle size={14} /> : <ShieldOff size={14} />}
                                                label={user.enabled ? "Activo" : "Bloqueado"}
                                                color={user.enabled ? "success" : "error"}
                                                size="small"
                                                variant="outlined"
                                            />
                                            {user.UserStatus === 'UNCONFIRMED' && (
                                                <Chip label="Sin Confirmar" color="warning" size="small" sx={{ ml: 1 }} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.UserCreateDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.UserLastModifiedDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* --- MENÚ DE ACCIONES --- */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={openGroupsDialog}>
                    <UsersIcon size={16} className="mr-2" /> Gestionar Grupos
                </MenuItem>
                <MenuItem onClick={toggleUserStatus} sx={{ color: selectedUser?.enabled ? 'error.main' : 'success.main' }}>
                    {selectedUser?.enabled ? <ShieldOff size={16} className="mr-2" /> : <Shield size={16} className="mr-2" />}
                    {selectedUser?.enabled ? 'Bloquear Acceso' : 'Desbloquear Acceso'}
                </MenuItem>
            </Menu>

            {/* --- MODAL DE GESTIÓN DE GRUPOS --- */}
            <Dialog open={openGroupModal} onClose={() => setOpenGroupModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Gestionar Grupos</DialogTitle>
                <DialogContent dividers>
                    <Box className="mb-4">
                        <Typography variant="subtitle2" gutterBottom>Usuario:</Typography>
                        <Chip label={selectedUser?.email} />
                    </Box>

                    <Typography variant="subtitle2" className="mb-2 mt-4">Grupos Disponibles:</Typography>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_GROUPS.map(group => {
                            const isInGroup = userGroups.includes(group);
                            return (
                                <Chip
                                    key={group}
                                    label={group}
                                    onClick={() => !groupLoading && handleManageGroup(group, isInGroup ? 'remove' : 'add')}
                                    color={isInGroup ? "primary" : "default"}
                                    variant={isInGroup ? "filled" : "outlined"}
                                    icon={isInGroup ? <CheckCircle size={14} /> : undefined}
                                    disabled={groupLoading}
                                    clickable
                                />
                            );
                        })}
                    </div>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        Nota: Al agregar o quitar un grupo, el usuario podría necesitar volver a iniciar sesión para ver los cambios reflejados.
                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenGroupModal(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}