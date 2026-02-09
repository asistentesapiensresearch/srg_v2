// src/components/builder/ExportTemplate.jsx
import React, { useState, useMemo } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, IconButton, Box
} from "@mui/material";
import { Copy, Check, X } from "lucide-react";
import JSONCodeInput from "./inputs/JSONCodeInput";

export default function ExportTemplate({
    open: openExport,
    onClose: setOpenExport,
    value: sections = [] // 🔥 CORRECCIÓN 1: Valor por defecto para evitar undefined
}) {
    const [copied, setCopied] = useState(false);


    const templateCode = useMemo(() => {
        // 🔥 CORRECCIÓN 2: Validación de seguridad
        if (!sections || !Array.isArray(sections)) {
            return "// No hay secciones para exportar";
        }

        try {
            // 1. Hacemos copia profunda segura
            const cleanSections = JSON.parse(JSON.stringify(sections));
            // 2. Función recursiva para marcar los IDs
            const markIds = (nodes) => {
                if (!Array.isArray(nodes)) return;
                nodes.forEach(node => {
                    node.id = "UUID_V4_MARKER";
                    if (node.children) markIds(node.children);
                });
            };

            markIds(cleanSections);

            // 3. Convertimos a string JSON con formato
            let jsonString = JSON.stringify(cleanSections, null, 4);

            // 4. Reemplazamos el marcador por la función JS uuidv4()
            jsonString = jsonString.replace(/"id": "UUID_V4_MARKER"/g, 'id: uuidv4()');

            // 5. Estructura final
            return `import { v4 as uuidv4 } from 'uuid';

export default {
    label: "Nuevo Template",
    description: "Exportado desde el editor",
    getSections: () => ${jsonString}
};`;
        } catch (error) {
            console.error("Error generando template:", error);
            return "// Error generando el código";
        }
    }, [sections]);

    const handleCopy = () => {
        navigator.clipboard.writeText(templateCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog
            onClose={() => setOpenExport(false)}
            open={openExport}
            maxWidth="md"
            fullWidth
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2}>
                <DialogTitle sx={{ p: 0 }}>Exportar como Código JS</DialogTitle>
                <IconButton onClick={() => setOpenExport(false)}>
                    <X size={20} />
                </IconButton>
            </Box>

            <DialogContent dividers>
                <JSONCodeInput
                    value={templateCode}
                    onChange={() => { }}
                    field={{ label: "Código JS para Template", default: "" }}
                    isJavascript={true}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenExport(false)} color="inherit">
                    Cerrar
                </Button>
                <Button
                    onClick={handleCopy}
                    variant="contained"
                    color={copied ? "success" : "primary"}
                    startIcon={copied ? <Check size={18} /> : <Copy size={18} />}
                >
                    {copied ? "Copiado!" : "Copiar Código"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}