import { Lock, LockOpen, TextFields } from "@mui/icons-material";
import { Stack } from "@mui/material";
import React, { useCallback, useState } from "react";
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
    rteRef
}) => {
    const extensions = useExtensions({ placeholder });
    const [isEditable, setIsEditable] = useState(true);
    const [showMenuBar, setShowMenuBar] = useState(true);

    if (import.meta.env.MODE === "RichTextEditorInpt") {
        useWhyDidYouUpdate("UploadInputForm", {
            content,
            placeholder,
            rteRef
        });
    }

    const handleNewImageFiles = useCallback(
        (files, insertPosition) => {
            if (!rteRef.current?.editor) {
                return;
            }
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
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
            return false;
        }
        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
            const insertPosition = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
            })?.pos;
            handleNewImageFiles(imageFiles, insertPosition);
            event.preventDefault();
            return true;
        }
        return false;
    },
        [handleNewImageFiles]
    );

    // Allow for pasting images
    const handlePaste =
        useCallback(
            (_view, event, _slice) => {
                if (!event.clipboardData) {
                    return false;
                }
                const pastedImageFiles = fileListToImageFiles(event.clipboardData.files);
                if (pastedImageFiles.length > 0) {
                    handleNewImageFiles(pastedImageFiles);
                    return true;
                }
                return false;
            },
            [handleNewImageFiles]
        );

    return (
        <>
            <RichTextEditor
                ref={rteRef}
                extensions={extensions}
                content={content}
                editable={isEditable}
                editorProps={{
                    handleDrop: handleDrop,
                    handlePaste: handlePaste,
                }}
                renderControls={() => <EditorMenuControls />}
                RichTextFieldProps={{
                    variant: "outlined",
                    MenuBarProps: {
                        hide: !showMenuBar,
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
                            }}
                        >
                            <MenuButton
                                value="formatting"
                                tooltipLabel={
                                    showMenuBar ? "Hide formatting" : "Show formatting"
                                }
                                size="small"
                                onClick={() => setShowMenuBar((currentState) => !currentState)}
                                selected={showMenuBar}
                                IconComponent={TextFields}
                            />

                            <MenuButton
                                value="formatting"
                                tooltipLabel={
                                    isEditable
                                        ? "Prevent edits (use read-only mode)"
                                        : "Allow edits"
                                }
                                size="small"
                                onClick={() => setIsEditable((currentState) => !currentState)}
                                selected={!isEditable}
                                IconComponent={isEditable ? Lock : LockOpen}
                            />
                        </Stack>
                    ),
                }}
                sx={{
                    "& .ProseMirror": {
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
        </>
    );
}

export default React.memo(RichTextEditorInpt)