import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Skeleton, Box, Tooltip } from '@mui/material';
import { Edit, Trash2, GripVertical, ImageOff } from 'lucide-react';
import { getUrl } from 'aws-amplify/storage';

export const BrandCard = ({ brand, loading, onEdit, onDelete, dragging }) => {
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        if (brand?.key) {
            // Maneja URLs directas (blobs) o paths de S3
            if (brand.key.startsWith('blob:') || brand.key.startsWith('http')) {
                setLogoUrl(brand.key);
            } else {
                getUrl({ path: brand.key }).then(res => setLogoUrl(res.url.toString())).catch(() => { });
            }
        }
    }, [brand]);

    // SKELETON LOADING
    if (loading) {
        return (
            <Card className="h-full border border-gray-100 rounded-xl shadow-none">
                <CardContent className="p-3 flex flex-col items-center gap-2">
                    <Skeleton variant="rectangular" width="100%" height={80} className="rounded-lg" />
                    <Skeleton variant="text" width="60%" />
                </CardContent>
            </Card>
        );
    }

    // TARJETA REAL
    return (
        <Card
            className={`
                relative group overflow-hidden rounded-xl border transition-all duration-200 bg-white
                ${dragging ? 'shadow-2xl ring-2 ring-blue-500 opacity-50 scale-105 cursor-grabbing' : 'hover:shadow-md border-gray-200'}
            `}
        >
            {/* --- ZONA DE ARRASTRE (Indicador Visual) --- */}
            <div className="absolute top-2 left-2 text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500 z-10">
                <GripVertical size={16} />
            </div>

            {/* --- ACCIONES (Hover) --- */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 z-10">
                <Tooltip title="Editar">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(brand); }} className="text-gray-500 hover:text-orange-600 hover:bg-orange-50 w-6 h-6">
                        <Edit size={12} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(brand); }} className="text-gray-500 hover:text-red-600 hover:bg-red-50 w-6 h-6">
                        <Trash2 size={12} />
                    </IconButton>
                </Tooltip>
            </div>

            <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-3">

                {/* --- CONTENEDOR LOGO --- */}
                <div className="w-full h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100 group-hover:bg-white transition-colors">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={brand.name}
                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            draggable={false} // Importante para no romper el DnD
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-300">
                            <ImageOff size={24} />
                            <span className="text-[10px] mt-1">Sin Logo</span>
                        </div>
                    )}
                </div>

                {/* --- NOMBRE --- */}
                <Typography
                    variant="body2"
                    className="font-semibold text-gray-700 text-center truncate w-full px-2"
                    title={brand.name}
                >
                    {brand.name}
                </Typography>

            </CardContent>
        </Card>
    );
};