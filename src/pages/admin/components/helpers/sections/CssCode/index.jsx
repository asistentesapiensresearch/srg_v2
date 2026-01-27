// src/view/sections/CssCode/index.jsx
import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import PageRenderer from '../../../builder/Renderer';

export default function CssCode({ id, css_code, children = [] }) {

    // Generamos un nombre de clase único basado en el ID de la sección
    // Reemplazamos guiones por nada para que sea una clase válida
    const scopeClass = useMemo(() => `scope-${id?.split('-')[0] || 'custom'}`, [id]);

    // Procesamos el código CSS para que ".custom-scope" se convierta en nuestra clase única
    const processedCss = useMemo(() => {
        if (!css_code) return "";
        // Reemplazamos todas las instancias de .custom-scope por la clase única
        return css_code.replaceAll('.custom-scope', `.${scopeClass}`);
    }, [css_code, scopeClass]);

    return (
        <Box className={`${scopeClass} w-full`}>
            {/* Inyectamos el CSS solo para esta instancia */}
            <style dangerouslySetInnerHTML={{ __html: processedCss }} />

            {children.length > 0 ? (
                <PageRenderer sections={children} />
            ) : (
                <Box className="p-10 border-2 border-dashed border-blue-200 bg-blue-50/30 text-center rounded-xl">
                    <p className="text-blue-400 text-sm font-medium">
                        Contenedor CSS activo. Agregue elementos para estilizarlos.
                    </p>
                </Box>
            )}
        </Box>
    );
}