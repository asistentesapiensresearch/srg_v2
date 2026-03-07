import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

export default function EcosystemCard({ article }) {
    const [imageUrl, setImageUrl] = useState("");

    // Cargar la imagen real desde S3
    useEffect(() => {
        if (article.icon) {
            getUrl({ path: article.icon }).then(res => setImageUrl(res.url.toString()));
        }
    }, [article.icon]);

    return (
        <Link to={`/noticias/${article.slug}`} className="no-underline group">
            <Card className="h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                {/* Imagen de Portada */}
                <Box className="h-48 w-full overflow-hidden bg-gray-100 relative">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <Box className="w-full h-full flex items-center justify-center text-gray-300">
                            <Newspaper size={48} />
                        </Box>
                    )}
                    <Box className="absolute top-4 left-4 bg-red-700 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Noticia
                    </Box>
                </Box>

                <CardContent className="p-6">
                    <Box className="flex items-center gap-2 text-gray-400 mb-3">
                        <Calendar size={14} />
                        <Typography variant="caption">
                            {new Date(article.createdAt || Date.now()).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </Typography>
                    </Box>

                    <Typography
                        variant="h6"
                        className="font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-3"
                    >
                        {article.title}
                    </Typography>

                    <Box
                        className="text-gray-500 text-sm line-clamp-3 mb-6"
                        dangerouslySetInnerHTML={{ __html: article.description }}
                    />

                    <Box className="flex items-center text-red-700 font-bold text-sm gap-1">
                        Leer más
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
}