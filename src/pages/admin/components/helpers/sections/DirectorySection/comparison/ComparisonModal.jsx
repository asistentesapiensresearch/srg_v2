// src/pages/admin/components/helpers/sections/DirectorySection/comparison/ComparisonModal.jsx
import React from 'react';
import {
    Dialog, DialogContent, IconButton, Box, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';
import { X, Trash2 } from 'lucide-react';
import { useComparison } from './ComparisonContext';

export default function ComparisonModal({ sourceConfig }) {
    const { isModalOpen, setIsModalOpen, selectedItems, removeItem } = useComparison();

    // Obtenemos las columnas configuradas para mostrar
    const columns = sourceConfig?.columns || [];
    const aliases = sourceConfig?.columnAliases || {};

    if (!isModalOpen) return null;

    return (
        <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="xl"
            fullWidth
            scroll="paper"
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2} borderBottom="1px solid #eee">
                <Typography variant="h6" fontWeight="bold">Comparativa de Instituciones</Typography>
                <IconButton onClick={() => setIsModalOpen(false)}><X /></IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <TableContainer component={Paper} elevation={0}>
                    <Table stickyHeader>
                        {/* CABECERA: Nombres de Colegios */}
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: '#f9f9f9', fontWeight: 'bold', width: '20%', minWidth: 150, borderBottom: '2px solid #ddd' }}>
                                    Característica
                                </TableCell>
                                {selectedItems.map((item, index) => (
                                    <TableCell key={index} align="center" sx={{ bgcolor: '#fff', borderBottom: '2px solid #ddd', minWidth: 200 }}>
                                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                            <Typography fontWeight="bold" color="primary" variant="subtitle1">
                                                {item.Nombre || item.Colegio}
                                            </Typography>
                                            <Button
                                                size="small"
                                                color="error"
                                                startIcon={<Trash2 size={14} />}
                                                onClick={() => removeItem(index)}
                                                sx={{ fontSize: '0.7rem' }}
                                            >
                                                Quitar
                                            </Button>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        {/* CUERPO: Atributos en filas */}
                        <TableBody>
                            {columns.map((colKey) => (
                                <TableRow key={colKey} hover>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary', bgcolor: '#fafafa' }}>
                                        {aliases[colKey] || colKey}
                                    </TableCell>
                                    {selectedItems.map((item, idx) => (
                                        <TableCell key={idx} align="center">
                                            {item[colKey] || '-'}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {/* Fila de acción final */}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                {selectedItems.map((item, idx) => (
                                    <TableCell key={idx} align="center">
                                        <Button variant="contained" size="small" disableElevation>
                                            Ver Detalles
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
}