import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Grid, Paper, Typography, Button,
    Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider
} from '@mui/material';
import {
    Building2, FileText, Tag, Users, ArrowRight,
    Plus, TrendingUp, Activity
} from 'lucide-react';
import { generateClient } from 'aws-amplify/data';
import { Preloader } from '@src/components/preloader';

const client = generateClient();

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        institutions: 0,
        research: 0,
        brands: 0
    });
    const [recentInstitutions, setRecentInstitutions] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Ejecutamos las peticiones en paralelo para mayor velocidad
            const [instData, resData, brandData] = await Promise.all([
                client.models.Institution.list(),
                client.models.Research.list(),
                client.models.Brand.list()
            ]);

            setStats({
                institutions: instData.data.length,
                research: resData.data.length,
                brands: brandData.data.length
            });

            // Filtramos las 5 instituciones más recientes (por updatedAt)
            const sortedInstitutions = [...instData.data]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5);

            setRecentInstitutions(sortedInstitutions);

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box className="flex h-screen items-center justify-center">
                <Preloader />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" className="py-8 fade-in">
            {/* --- HEADER --- */}
            <Box className="mb-8 flex justify-between items-end">
                <div>
                    <Typography variant="overline" className="text-gray-500 font-bold tracking-wider">
                        Panel de Control
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-800">
                        Bienvenido, Administrador
                    </Typography>
                    <Typography variant="body1" className="text-gray-500">
                        Aquí tienes un resumen de la actividad de la plataforma.
                    </Typography>
                </div>
                <Box className="hidden md:block">
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => navigate('/admin/research')}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        Nueva Investigación
                    </Button>
                </Box>
            </Box>

            {/* --- KPI CARDS --- */}
            <Grid container spacing={3} className="mb-8">
                <StatCard
                    title="Instituciones"
                    value={stats.institutions}
                    icon={<Building2 size={24} className="text-blue-600" />}
                    color="bg-blue-50"
                    onClick={() => navigate('/admin/institutions')}
                />
                <StatCard
                    title="Investigaciones"
                    value={stats.research}
                    icon={<FileText size={24} className="text-purple-600" />}
                    color="bg-purple-50"
                    onClick={() => navigate('/admin/research')}
                />
                <StatCard
                    title="Marcas / Aliados"
                    value={stats.brands}
                    icon={<Tag size={24} className="text-orange-600" />}
                    color="bg-orange-50"
                    onClick={() => navigate('/admin/brands')}
                />
                <StatCard
                    title="Usuarios Activos"
                    value="--"
                    icon={<Users size={24} className="text-green-600" />}
                    color="bg-green-50"
                    subtext="Gestión vía Cognito"
                />
            </Grid>

            {/* --- MAIN CONTENT GRID --- */}
            <Grid container spacing={4}>

                {/* LISTA RECIENTE */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={0} className="border border-gray-200 rounded-xl overflow-hidden h-full">
                        <Box className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <Box className="flex items-center gap-2">
                                <Activity size={18} className="text-gray-500" />
                                <Typography variant="subtitle1" fontWeight="bold" className="text-gray-700">
                                    Instituciones Actualizadas Recientemente
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                endIcon={<ArrowRight size={16} />}
                                onClick={() => navigate('/admin/institutions')}
                                sx={{ textTransform: 'none' }}
                            >
                                Ver todas
                            </Button>
                        </Box>

                        <List className="py-0">
                            {recentInstitutions.map((inst, index) => (
                                <React.Fragment key={inst.id}>
                                    <ListItem
                                        onClick={() => navigate(`/admin/institutions`)} // Podrías llevar al detalle/edit
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={inst.logo} // Amplify maneja URLs pre-firmadas, si la tienes cacheada o pública mejor
                                                alt={inst.name}
                                                className="bg-gray-100 text-gray-400 border border-gray-200"
                                            >
                                                <Building2 size={20} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<span className="font-semibold text-gray-800">{inst.name}</span>}
                                            secondary={
                                                <span className="text-xs text-gray-500">
                                                    Actualizado: {new Date(inst.updatedAt).toLocaleDateString()}
                                                </span>
                                            }
                                        />
                                        <Box className="flex items-center gap-2">
                                            {inst.adminEmail ? (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                    Asignado
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                                                    Sin Admin
                                                </span>
                                            )}
                                        </Box>
                                    </ListItem>
                                    {index < recentInstitutions.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                            {recentInstitutions.length === 0 && (
                                <Box className="p-8 text-center text-gray-400">
                                    No hay actividad reciente.
                                </Box>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* SIDEBAR DE ACCIONES RÁPIDAS */}
                <Grid size={{ sx: 12, md: 4 }}>
                    <Paper elevation={0} className="border border-gray-200 rounded-xl p-5 bg-linear-to-br from-gray-800 to-gray-900 text-white h-full">
                        <Typography variant="h6" fontWeight="bold" gutterBottom className="flex items-center gap-2 text-white">
                            <TrendingUp size={20} className="text-yellow-400" />
                            Acciones Rápidas
                        </Typography>
                        <Typography variant="body2" className="text-gray-300 mb-6">
                            Accesos directos para la gestión frecuente de la plataforma.
                        </Typography>

                        <div className="flex flex-col gap-3">
                            <QuickActionButton
                                label="Crear Nueva Investigación"
                                onClick={() => navigate('/admin/research')}
                            />
                            <QuickActionButton
                                label="Gestionar Marcas y Aliados"
                                onClick={() => navigate('/admin/brands')}
                            />
                            <QuickActionButton
                                label="Ver Micrositios Públicos"
                                onClick={() => window.open('/', '_blank')}
                            />
                        </div>

                        <Box className="mt-8 pt-6 border-t border-gray-700">
                            <Typography variant="caption" className="text-gray-400 block mb-1">
                                ESTADO DEL SISTEMA
                            </Typography>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                <Typography variant="body2" className="font-medium text-green-400">
                                    Operativo
                                </Typography>
                            </div>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Container>
    );
}

// --- SUBCOMPONENTES ---

const StatCard = ({ title, value, icon, color, subtext, onClick }) => (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
            elevation={0}
            onClick={onClick}
            className={`
                p-5 border border-gray-200 rounded-xl h-full flex flex-col justify-between
                transition-all duration-200 
                ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200 hover:bg-gray-50' : ''}
            `}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
                {onClick && <ArrowRight size={18} className="text-gray-300" />}
            </div>
            <div>
                <Typography variant="h4" className="font-bold text-gray-800">
                    {value}
                </Typography>
                <Typography variant="body2" className="text-gray-500 font-medium">
                    {title}
                </Typography>
                {subtext && (
                    <Typography variant="caption" className="text-gray-400 mt-1 block">
                        {subtext}
                    </Typography>
                )}
            </div>
        </Paper>
    </Grid>
);

const QuickActionButton = ({ label, onClick }) => (
    <Button
        variant="outlined"
        fullWidth
        onClick={onClick}
        sx={{
            justifyContent: 'flex-start',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.2)',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.05)'
            }
        }}
    >
        {label}
    </Button>
);