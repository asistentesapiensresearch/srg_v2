import { Card, Box, Chip } from "@mui/material";

export const AdCard = ({ primaryColor }) => {
    return (
        <Card style={{
            background: primaryColor,
            color: 'white',
            padding: 32, // Usar padding numérico o sx
            borderRadius: 16,
            display: 'flex', // Corregido alignItems requiere display flex
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: 100,
            height: '100%' // Para que ocupe todo el grid
        }}>
            {/* Elemento decorativo */}
            <Box sx={{
                position: 'absolute',
                top: -50, right: -50,
                width: 200, height: 200,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.1)'
            }} />
            
            <Box flex={1} zIndex={1} width="100%">
                <Chip
                    label="Publicidad"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 10, left: 10,
                        bgcolor: 'white',
                        color: primaryColor,
                        fontWeight: 'bold'
                    }}
                />
                {/* Aquí puedes poner el contenido real del anuncio */}
                <Box mt={4} textAlign="center">
                    Espacio Publicitario
                </Box>
            </Box>
        </Card>
    );
};