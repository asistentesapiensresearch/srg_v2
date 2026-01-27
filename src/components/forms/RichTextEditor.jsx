import { Lock, LockOpen, TextFields, Code, Visibility } from "@mui/icons-material";
import { Stack, TextField, Box } from "@mui/material";
import React, { useCallback, useState, useEffect } from "react";
import {
    LinkBubbleMenu,
    MenuButton,
    RichTextEditor,
    TableBubbleMenu,
    insertImages
} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "../../hooks/useExtension";
import useWhyDidYouUpdate from "@src/hooks/useWhyDidYouUpdate";

function fileListToImageFiles(fileList) {
    return Array.from(fileList).filter((file) => {
        const mimeType = (file.type || "").toLowerCase();
        return mimeType.startsWith("image/");
    });
}

const RichTextEditorInpt = ({
    content,
    placeholder = "Add your own content here...",
    rteRef,
    onChange
}) => {
    const extensions = useExtensions({ placeholder });
    const [isEditable, setIsEditable] = useState(true);
    const [showMenuBar, setShowMenuBar] = useState(true);
    const [showCode, setShowCode] = useState(false); // 🔥 Nuevo estado para modo código

    if (import.meta.env.MODE === "RichTextEditorInpt") {
        useWhyDidYouUpdate("UploadInputForm", {
            content,
            placeholder,
            rteRef
        });
    }

    // --- Lógica para sincronizar Código -> Visual ---
    const toggleCodeView = () => {
        const editor = rteRef.current?.editor;
        if (!editor) return;

        if (showCode) {
            // Si estábamos viendo código y volvemos a visual, 
            // nos aseguramos de que el editor tenga el contenido actualizado
            editor.commands.setContent(content, true);
        }
        setShowCode(!showCode);
    };

    const handleNewImageFiles = useCallback(
        (files, insertPosition) => {
            if (!rteRef.current?.editor) return;
            const attributesForImageFiles = files.map((file) => ({
                src: URL.createObjectURL(file),
                alt: file.name,
            }));
            insertImages({
                images: attributesForImageFiles,
                editor: rteRef.current.editor,
                position: insertPosition,
            });
        }, []
    );

    const handleDrop = useCallback((view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) return false;
        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
            const insertPosition = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
            handleNewImageFiles(imageFiles, insertPosition);
            event.preventDefault();
            return true;
        }
        return false;
    }, [handleNewImageFiles]);

    const handlePaste = useCallback((_view, event, _slice) => {
        if (!event.clipboardData) return false;
        const pastedImageFiles = fileListToImageFiles(event.clipboardData.files);
        if (pastedImageFiles.length > 0) {
            handleNewImageFiles(pastedImageFiles);
            return true;
        }
        return false;
    }, [handleNewImageFiles]);

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            <RichTextEditor
                ref={rteRef}
                extensions={extensions}
                content={content}
                editable={isEditable && !showCode} // Si está en modo código, el editor visual no debe ser editable
                editorProps={{
                    handleDrop: handleDrop,
                    handlePaste: handlePaste,
                }}
                onUpdate={({ editor }) => {
                    const html = editor.getHTML();
                    if (onChange) onChange(html);
                }}
                renderControls={() => <EditorMenuControls />}
                RichTextFieldProps={{
                    variant: "outlined",
                    MenuBarProps: {
                        hide: !showMenuBar || showCode, // Ocultar barra de herramientas en modo código
                    },
                    footer: (
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                borderTopStyle: "solid",
                                borderTopWidth: 1,
                                borderTopColor: (theme) => theme.palette.divider,
                                py: 1,
                                px: 1.5,
                                bgcolor: (theme) => theme.palette.background.paper,
                            }}
                        >
                            <MenuButton
                                value="formatting"
                                tooltipLabel={showMenuBar ? "Hide formatting" : "Show formatting"}
                                size="small"
                                onClick={() => setShowMenuBar((s) => !s)}
                                selected={showMenuBar}
                                IconComponent={TextFields}
                                disabled={showCode}
                            />

                            {/* 🔥 Botón para ver código fuente */}
                            <MenuButton
                                value="code"
                                tooltipLabel={showCode ? "Ver Editor Visual" : "Ver Código HTML"}
                                size="small"
                                onClick={toggleCodeView}
                                selected={showCode}
                                IconComponent={showCode ? Visibility : Code}
                            />

                            <MenuButton
                                value="lock"
                                tooltipLabel={isEditable ? "Modo Lectura" : "Permitir Edición"}
                                size="small"
                                onClick={() => setIsEditable((s) => !s)}
                                selected={!isEditable}
                                IconComponent={isEditable ? Lock : LockOpen}
                                disabled={showCode}
                            />
                        </Stack>
                    ),
                }}
                sx={{
                    // Ocultamos el área del editor visual si showCode es true
                    "& .ProseMirror": {
                        display: showCode ? "none" : "block",
                        minHeight: "150px",
                        "& h1, & h2, & h3, & h4, & h5, & h6": {
                            scrollMarginTop: showMenuBar ? 50 : 0,
                        },
                    },
                }}
            >
                {() => (
                    <>
                        <LinkBubbleMenu />
                        <TableBubbleMenu />
                    </>
                )}
            </RichTextEditor>

            {/* 🔥 Vista de Código (aparece cuando showCode es true) */}
            {showCode && (
                <TextField
                    fullWidth
                    multiline
                    rows={10}
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{
                        mt: -1, // Ajuste para que parezca estar dentro del mismo marco
                        "& .MuiInputBase-root": {
                            fontFamily: "monospace",
                            fontSize: "13px",
                            borderRadius: "0 0 4px 4px",
                            bgcolor: "#fafafa",
                        },
                    }}
                />
            )}
        </Box>
    );
}

export default React.memo(RichTextEditorInpt);