// src/view/sections/DirectorySection/results/AdCard.jsx
import { Card, Box, Chip, Typography, Button } from "@mui/material";

export const AdCard = ({ item, primaryColor }) => {
    return (
        <Card style={{
            background: primaryColor,
            color: 'white',
            p: 4,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: 100,
        }} className={`h-full flex flex-col`}>
            {/* Elemento decorativo de fondo */}
            <div>
                <Box sx={{
                    position: 'absolute',
                    top: -50, right: -50,
                    width: 200, height: 200,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)'
                }} />
                <Box flex={1} zIndex={1}>
                    <Chip
                        label="Publicidad"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 10, left: 10,
                            width: 100, height: 20,
                            bgcolor: 'white',
                            color: primaryColor,
                            mb: 2,
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
                asd
            </div>
        </Card>
    );
};