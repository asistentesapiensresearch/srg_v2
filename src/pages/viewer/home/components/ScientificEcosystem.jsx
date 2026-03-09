import { Typography, Box, Grid, Button } from "@mui/material";
import { ArrowRight, Newspaper } from "lucide-react";
import EcosystemCard from "./EcosystemCard";
import { Link } from "react-router-dom";

export default function ScientificEcosystem({ articles = [] }) {
    // Mostramos las últimas 4 noticias publicadas
    const featuredArticles = articles
        .filter(a => a.isPublished)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 4);

    return (
        <section className="space-y-10">
            <Box className="flex justify-between items-center">
                <Box className="flex items-center gap-4">
                    <div className="h-10 w-2 bg-red-700 rounded-full" />
                    <Typography variant="h4" fontWeight="bold" className="text-gray-900">
                        Ecosistema Científico
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {featuredArticles.map((article) => (
                    <Grid key={article.id} size={{ xs: 12, md: 3 }}>
                        <EcosystemCard article={article} />
                    </Grid>
                ))}
            </Grid>

            {/* BOTÓN VER MÁS */}
            <Box className="flex justify-center pt-4">
                <Button
                    component={Link}
                    to="/noticias"
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowRight size={20} />}
                    sx={{
                        borderRadius: 'full',
                        px: 6,
                        py: 1.5,
                        color: 'red.700',
                        borderColor: 'red.700',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'red.50', borderColor: 'red.800' }
                    }}
                >
                    Ver más noticias
                </Button>
            </Box>
        </section>
    );
}