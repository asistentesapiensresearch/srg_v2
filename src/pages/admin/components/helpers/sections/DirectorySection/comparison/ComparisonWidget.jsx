import React from 'react';
import { Box, Button, Typography, Zoom, Paper } from '@mui/material';
import { ArrowLeftRight, Trash2 } from 'lucide-react';
import { useComparison } from './ComparisonContext';

export default function ComparisonWidget() {
    const { selectedItems, setIsModalOpen, clearComparison } = useComparison();

    if (selectedItems.length === 0) return null;

    return (
        <Zoom in={selectedItems.length > 0}>
            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1300,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1,
                    pl: 3,
                    borderRadius: 50,
                    bgcolor: '#1a1a1a',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                <Typography variant="body2" fontWeight="500">
                    {selectedItems.length} {selectedItems.length === 1 ? 'colegio' : 'colegios'}
                </Typography>

                <Box display="flex" gap={1}>
                    <Button
                        size="small"
                        sx={{ color: '#aaa', minWidth: 'auto', borderRadius: 20 }}
                        onClick={clearComparison}
                    >
                        <Trash2 size={16} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<ArrowLeftRight size={16} />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{ borderRadius: 20, px: 2, fontWeight: 'bold' }}
                        disabled={selectedItems.length < 2}
                    >
                        Comparar
                    </Button>
                </Box>
            </Paper>
        </Zoom>
    );
}