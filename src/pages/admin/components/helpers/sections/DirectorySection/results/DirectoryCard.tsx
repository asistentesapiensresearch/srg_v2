import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import {
    ArrowDown as ArrowDownIcon, // Corregido nombre común en lucide
} from "lucide-react";
import { CardItemCol } from "../cardItemByType/CardItemCol";
import CardItemMtop from "../cardItemByType/CardItemMtop";


const cardByType = {
  "COL": CardItemCol,
  "M-TOP": CardItemMtop
};

export const DirectoryCard = ({ item, primaryColor = '#337ab7', type}) => {
    const Vinculada = item.isLinked;
    const CardComponent = cardByType[type] || CardItemCol;
    console.log("type ", type);
    return (
        <>

            <CardComponent item={item} primaryColor={primaryColor} />

            {/* Sección de Historial (Accordion) */}
            {Vinculada && item.history?.length > 0 && (
                <Accordion
                    elevation={0}
                    sx={{
                        mt: -1,
                        mb: 2,
                        border: '1px solid #eee',
                        borderTop: 'none',
                        '&:before': { display: 'none' }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ArrowDownIcon size={16} />}
                        sx={{ minHeight: 40, bgcolor: '#f9f9f9' }}
                    >
                        <Typography variant="caption" fontWeight="bold" color="text.secondary">
                            Ver historial de clasificaciones ({item.history.length})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, bgcolor: '#fafafa' }}>
                        {item.history.map((histItem, index) => (
                            // Renderizamos recursivamente, pero quizás quieras un diseño más simple para el historial
                            <CardComponent item={item} primaryColor={primaryColor} />
                        ))}
                    </AccordionDetails>
                </Accordion>
            )}
        </>
    );
};