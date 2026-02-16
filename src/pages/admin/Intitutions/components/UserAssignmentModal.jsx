import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, List, ListItem, ListItemAvatar, ListItemText,
    Avatar, TextField, InputAdornment, Chip, Skeleton,
    Typography, Box
} from '@mui/material';
import { Search, CheckCircle, User } from 'lucide-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient();

export const UserAssignmentModal = ({ open, onClose, institution, onAssign }) => {
    // Inicializamos siempre como array vacío
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);

    useEffect(() => {
        if (open) {
            fetchUsers();
            setSelectedUserEmail({ email: institution?.adminEmail || null });
        }
    }, [open, institution]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await client.queries.listCognitoUsers();

            let parsedUsers = [];

            if (data) {
                // 1. Intentar parsear si es string
                const raw = typeof data === 'string' ? JSON.parse(data) : data;

                // 2. Verificar si el resultado es un Array
                if (Array.isArray(raw)) {
                    parsedUsers = raw;
                } else if (raw && typeof raw === 'object') {
                    // Por si acaso viene envuelto en un objeto { users: [...] }
                    // o si la lambda devolvió un objeto de error
                    console.warn("La respuesta no es un array directo:", raw);
                    parsedUsers = Array.isArray(raw.users) ? raw.users : [];
                }
            }

            setUsers(parsedUsers);

        } catch (error) {
            console.error("Error fetching users", error);
            setUsers([]); // En caso de error, resetear a array vacío
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = () => {
        onAssign(institution.id, selectedUserEmail);
        onClose();
    };

    // 🔥 PROTECCIÓN: Validamos que 'users' sea array antes de filtrar
    const safeUsers = Array.isArray(users) ? users : [];

    const filteredUsers = safeUsers.filter(u =>
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
                <Typography fontWeight="bold">Asignar Administrador</Typography>
                <Typography variant="caption" color="text.secondary">
                    Selecciona el usuario encargado de {institution?.name}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar usuario..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search size={18} className="text-gray-400 mr-2" /></InputAdornment>
                    }}
                    sx={{ mb: 2, mt: 1 }}
                />

                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {loading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} height={60} sx={{ mb: 1, borderRadius: 2 }} variant="rectangular" />)
                    ) : (
                        filteredUsers.map((user, index) => {
                            const isSelected = selectedUserEmail.email === user.email;
                            // Usamos email o username como key única
                            const uniqueKey = user.username || user.email || index;

                            return (
                                <ListItem
                                    key={uniqueKey}
                                    onClick={() => setSelectedUserEmail(user)}
                                    sx={{
                                        borderRadius: 2, mb: 1, border: '1px solid',
                                        borderColor: isSelected ? 'primary.main' : 'transparent',
                                        bgcolor: isSelected ? 'action.selected' : 'transparent',
                                        '&:hover': { bgcolor: isSelected ? 'action.selected' : 'grey.50' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: isSelected ? 'primary.main' : 'grey.300' }}>
                                            <User size={20} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.name || "Usuario sin nombre"}
                                        secondary={user.email || "Sin correo"}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                    {isSelected && <CheckCircle size={20} className="text-blue-600" />}
                                </ListItem>
                            );
                        })
                    )}
                    {!loading && filteredUsers.length === 0 && (
                        <Box py={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            <Typography color="text.secondary">No se encontraron usuarios</Typography>
                        </Box>
                    )}
                </List>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>Cancelar</Button>
                <Button
                    onClick={handleAssign}
                    variant="contained"
                    disabled={loading}
                    disableElevation
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Guardar Asignación
                </Button>
            </DialogActions>
        </Dialog>
    );
};