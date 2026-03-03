import { Box, Card, Typography, Stack, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { Award, Target, ChevronRight } from "lucide-react";

// ==================== SUB-COMPONENTE: CARD INDIVIDUAL ====================
const RankingCard = ({ ranking }) => {
    const { title, path, description, indicators = [] } = ranking;

    return (
        <div className="mt-5 rounded-xl overflow-hidden shadow-md bg-white border-t-8 border-red-700 flex flex-col h-full transition-all hover:shadow-xl">
            {/* Header de la Card */}
            <div className="p-4 bg-gray-50/50 border-bottom">
                <h3 className="font-bold text-lg uppercase flex items-center gap-2 text-gray-800">
                    <Award size={20} className="text-red-700" />
                    {title}
                </h3>
            </div>
            
            <div className="p-5 pt-0 flex-1 flex flex-col gap-6">
                {/* Elemento Principal: El Ranking General */}
                <Link to={path} className="group no-underline">
                    <Card variant="outlined" className="p-5 transition-all group-hover:border-red-300 group-hover:bg-red-50/30">
                        <Box className="flex justify-between items-center">
                            <Box>
                                <Typography className="font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                                    Ver Ranking General
                                </Typography>
                                {description && (
                                    <Box 
                                        className="mt-2 text-gray-600 line-clamp-2 text-sm" 
                                        dangerouslySetInnerHTML={{ __html: description }} 
                                    />
                                )}
                            </Box>
                            <ChevronRight className="text-gray-300 group-hover:text-red-700 group-hover:translate-x-1 transition-all" />
                        </Box>
                    </Card>
                </Link>

                {/* Sub-sección: Indicadores Específicos (Si existen) */}
                {indicators.length > 0 && (
                    <Box>
                        <Divider className="mb-4">
                            <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider px-2">
                                Indicadores Específicos
                            </Typography>
                        </Divider>
                        
                        <Stack spacing={1}>
                            {indicators.map((indicator) => (
                                <Link to={indicator.path} key={indicator.id} className="no-underline group/item">
                                    <Box className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                                            <Target size={16} />
                                        </div>
                                        <Typography className="text-gray-700 font-medium group-hover/item:text-red-800 transition-colors">
                                            {indicator.title}
                                        </Typography>
                                        <ChevronRight size={14} className="ms-auto text-gray-300 opacity-0 group-hover/item:opacity-100 transition-all" />
                                    </Box>
                                </Link>
                            ))}
                        </Stack>
                    </Box>
                )}
            </div>
        </div>
    );
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function MainRankings({ rankings = [] }) {
    if (!rankings || !Array.isArray(rankings)) return null;

    return (
        <section id="research-section" className="space-y-6">
            <Box className="flex items-center gap-2 mb-2">
                <div className="h-8 w-1 bg-red-700 rounded-full" />
                <Typography variant="h5" fontWeight="bold" className="text-gray-900">
                    Rankings Generales e Indicadores
                </Typography>
            </Box>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rankings.map((ranking) => (
                    <RankingCard
                        key={ranking.id}
                        ranking={ranking}
                    />
                ))}
            </div>
        </section>
    );
}