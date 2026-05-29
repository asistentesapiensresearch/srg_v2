import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import {
    ArrowDown as ArrowDownIcon,
} from "lucide-react";
import { cardByType } from "../helpers/cardsByType";

export const DirectoryCard = ({ item, primaryColor = '#337ab7', type, selectedPreset }) => {

    const Vinculada = item.isLinked;
    const isCompactMode = selectedPreset === "Todos";

    const CardComponent = isCompactMode
        ? (cardByType[type]?.cardDirectoryCompact || cardByType["COL"]?.cardDirectoryCompact)
        : (cardByType[type]?.cardDirectory || cardByType["COL"]?.cardDirectory);

    return (
        <>
            <CardComponent item={item} primaryColor={primaryColor} />

            {/* Sección de Historial (Accordion) - solo en modo normal */}
            {!isCompactMode && Vinculada && item.history?.length > 0 && (
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
                            <CardComponent key={`history-${histItem.path}_${index}`} item={histItem} primaryColor={primaryColor} />
                        ))}
                    </AccordionDetails>
                </Accordion>
            )}
        </>
    );
};