// src/view/sections/WysiwygSection/index.jsx
import { Box, Container } from "@mui/material";
import React, { useId } from "react"; // 1. Importamos useId

const WysiwygSection = ({
    content,
    paddingY = 4,
    maxWidth = "lg",
    className = "",
    customCss = ""
}) => {
    // 2. Generamos un ID único para este bloque específico.
    // React.useId devuelve strings tipo ":r1:", los dos puntos (:) dan problemas en CSS,
    // así que los eliminamos con .replace
    const uniqueId = `section-${useId().replace(/:/g, "")}`;

    return (
        // 3. Asignamos el ID al contenedor padre
        <Container className="px-[0!important]" maxWidth={maxWidth} id={uniqueId}>

            {/* 4. Envolvemos el CSS del usuario dentro del ID generado */}
            {customCss && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    #${uniqueId} {
                        ${customCss}
                    }
                `}} />
            )}

            <Box
                sx={{
                    py: paddingY,
                    "& .ProseMirror": { outline: 'none' },
                    "& h1": { fontSize: '2.5rem', mb: 2 },
                    "& h2": { fontSize: '2rem', mb: 2 },
                    "& p": { mb: 1.5, lineHeight: 1.6 },
                    "& img": { maxWidth: '100%', height: 'auto', borderRadius: 2 },
                    "& table": { borderCollapse: 'collapse', width: '100%', mb: 2 },
                    "& th, & td": { border: '1px solid #ddd', p: 1 },
                    "& a": { color: 'primary.main' }
                }}
                className={`wysiwyg-content ${className}`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </Container>
    );
};

export default React.memo(WysiwygSection);