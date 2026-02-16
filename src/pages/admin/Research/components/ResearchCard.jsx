import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";
import { Link } from "react-router-dom"; // Opcional si usas link directo
import {
    Card, CardContent, Typography, IconButton, Skeleton, Box, Chip, Tooltip
} from "@mui/material";
import { Edit, Trash2, LayoutTemplate, CalendarDays, GitBranch, Tag } from "lucide-react";

export const ResearchCard = ({
    research,
    loading,
    handleClickEdit,
    handleClickDelete,
    // Puedes pasar una función para navegar al builder, o usar Link directo
    handleClickBuilder
}) => {
    const [iconUrl, setIconUrl] = useState(null);

    useEffect(() => {
        if (research) {
            // Resolver Icono (maneja blobs locales y URLs de S3)
            if (research.icon) {
                if (research.icon.startsWith('blob:') || research.icon.startsWith('http')) {
                    setIconUrl(research.icon);
                } else {
                    getUrl({ path: research.icon }).then(res => setIconUrl(res.url.toString())).catch(() => { });
                }
            }
        }
    }, [research]);

    // --- SKELETON LOADING (Igual que InstitutionCard) ---
    if (loading) {
        return (
            <Card className="h-full flex flex-col shadow-sm border border-gray-100 rounded-xl">
                <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex justify-between items-start">
                        <Skeleton variant="rectangular" width={60} height={60} className="rounded-lg" />
                        <Skeleton variant="circular" width={24} height={24} />
                    </div>
                    <Skeleton variant="text" width="80%" height={30} />
                    <Skeleton variant="text" width="50%" />
                    <Box mt={2} display="flex" gap={1}>
                        <div className="w-full">
                            <Skeleton variant="text" width="100%" />
                        </div>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // --- TARJETA REAL ---
    return (
        <Card className="h-full flex flex-col relative group hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <CardContent className="p-5 flex flex-col h-full">

                {/* CABECERA: Icono + Categoría */}
                <div className="flex justify-between items-start mb-3">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden p-2">
                        {iconUrl ? (
                            <img src={iconUrl} alt={research.title} className="w-full h-full object-contain" />
                        ) : (
                            // Fallback visual si no hay icono
                            <LayoutTemplate className="text-blue-300" size={32} />
                        )}
                    </div>

                    {/* Chip de Categoría */}
                    {research.category && (
                        <Chip
                            label={research.category}
                            size="small"
                            className="bg-purple-50 text-purple-700 font-semibold text-[10px] h-6 border-none"
                        />
                    )}
                </div>

                {/* INFO PRINCIPAL */}
                <Typography variant="h6" className="font-bold leading-tight mb-1 line-clamp-2 text-gray-800" title={research.title}>
                    {research.title}
                </Typography>

                <div className="flex items-center gap-1 text-gray-500 mb-4">
                    <Tag size={12} />
                    <Typography variant="caption" className="font-medium block truncate">
                        {research.subCategory || "General"}
                    </Typography>
                </div>

                <div className="flex-grow"></div>

                {/* FOOTER: FECHAS Y VERSIÓN */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">

                    {/* Rango de Fechas */}
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 p-1 rounded-md">
                            <CalendarDays size={14} className="text-gray-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                            {research.dateRange || "N/A"}
                        </span>
                    </div>

                    {/* Versión */}
                    <Tooltip title="Versión del template">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                            <GitBranch size={10} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-500">
                                v{research.version ?? 1}
                            </span>
                        </div>
                    </Tooltip>
                </div>

                {/* ACCIONES FLOTANTES (Hover) */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-gray-100 transform translate-y-[-5px] group-hover:translate-y-0 duration-200 z-10">

                    {/* Botón Personalizar / Builder */}
                    <Link to={`/admin/research/${research.id}`}>
                        <Tooltip title="Diseñar Template">
                            <IconButton size="small" className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                                <LayoutTemplate size={16} />
                            </IconButton>
                        </Tooltip>
                    </Link>

                    {/* Botón Editar */}
                    <Tooltip title="Editar Info">
                        <IconButton size="small" onClick={() => handleClickEdit(research)} className="text-gray-500 hover:text-orange-600 hover:bg-orange-50">
                            <Edit size={16} />
                        </IconButton>
                    </Tooltip>

                    {/* Botón Eliminar */}
                    <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => handleClickDelete(research.id)} className="text-gray-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                        </IconButton>
                    </Tooltip>
                </div>

            </CardContent>
        </Card>
    );
};