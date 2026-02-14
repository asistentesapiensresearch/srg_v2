import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";
import {
    Card, CardContent, Typography, IconButton, Skeleton, Box, Chip, Avatar, Tooltip
} from "@mui/material";
import { Edit, Trash2, Globe, LayoutTemplate } from "lucide-react";

export const InstitutionCard = ({ institution, loading, handleClickEdit, handleClickDelete, handleClickBuilder }) => {
    const [logoUrl, setLogoUrl] = useState(null);
    const [rectorUrl, setRectorUrl] = useState(null);

    useEffect(() => {
        if (institution) {
            // Resolver Logo
            if (institution.logo) {
                if (institution.logo.startsWith('blob:') || institution.logo.startsWith('http')) {
                    setLogoUrl(institution.logo);
                } else {
                    getUrl({ path: institution.logo }).then(res => setLogoUrl(res.url.toString())).catch(() => { });
                }
            }

            // Resolver Foto Rector
            if (institution.rectorPhoto) {
                if (institution.rectorPhoto.startsWith('blob:') || institution.rectorPhoto.startsWith('http')) {
                    setRectorUrl(institution.rectorPhoto);
                } else {
                    getUrl({ path: institution.rectorPhoto }).then(res => setRectorUrl(res.url.toString())).catch(() => { });
                }
            }
        }
    }, [institution]);

    // SKELETON LOADING
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
                        <Skeleton variant="circular" width={32} height={32} />
                        <div className="w-full">
                            <Skeleton variant="text" width="100%" />
                            <Skeleton variant="text" width="60%" />
                        </div>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // TARJETA REAL
    return (
        <Card className="h-full flex flex-col relative group hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden bg-white">
            <CardContent className="p-5 flex flex-col h-full">

                {/* CABECERA */}
                <div className="flex justify-between items-start mb-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden p-1">
                        {logoUrl ? (
                            <img src={logoUrl} alt={institution.name} className="w-full h-full object-contain" />
                        ) : (
                            <span className="text-[10px] text-gray-400 text-center leading-tight">Sin Logo</span>
                        )}
                    </div>
                    <Chip
                        label={institution.type}
                        size="small"
                        className="bg-blue-50 text-blue-700 font-semibold text-[10px] h-6 border-none"
                    />
                </div>

                {/* INFO PRINCIPAL */}
                <Typography variant="h6" className="font-bold leading-tight mb-1 line-clamp-2 text-gray-800" title={institution.name}>
                    {institution.name}
                </Typography>

                <Typography variant="caption" className="text-gray-500 mb-4 block font-medium">
                    {institution.subtype}
                </Typography>

                <div className="flex-grow"></div>

                {/* RECTOR */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                    <Avatar
                        src={rectorUrl}
                        alt={institution.rectorName}
                        sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}
                    />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rector(a)</span>
                        <span className="text-sm text-gray-700 truncate font-medium" title={institution.rectorName}>
                            {institution.rectorName || "No asignado"}
                        </span>
                    </div>
                </div>

                {/* ACCIONES FLOTANTES (Hover) */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-gray-100 transform translate-y-[-5px] group-hover:translate-y-0 duration-200 z-10">

                    {/* 🔥 BOTÓN DEL BUILDER / TEMPLATE */}
                    <Tooltip title="Diseñar Micrositio">
                        <IconButton size="small" onClick={() => handleClickBuilder(institution)} className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                            <LayoutTemplate size={16} />
                        </IconButton>
                    </Tooltip>

                    {institution.website && (
                        <a href={institution.website} target="_blank" rel="noopener noreferrer">
                            <Tooltip title="Ir al sitio web">
                                <IconButton size="small" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                                    <Globe size={16} />
                                </IconButton>
                            </Tooltip>
                        </a>
                    )}

                    <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleClickEdit(institution)} className="text-gray-500 hover:text-orange-600 hover:bg-orange-50">
                            <Edit size={16} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => handleClickDelete(institution.id)} className="text-gray-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                        </IconButton>
                    </Tooltip>
                </div>

            </CardContent>
        </Card>
    );
};