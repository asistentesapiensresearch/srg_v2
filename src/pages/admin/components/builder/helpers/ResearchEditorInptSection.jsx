import RichTextEditorInpt from "@src/components/forms/RichTextEditor";
import { useRef } from "react";

export function ResearchEditorInptSection({ content, onChange }) {
    console.log('content',content)
    const rteRefDesc = useRef(null);
    return (
        <RichTextEditorInpt
            placeholder="Descripción"
            rteRef={rteRefDesc}
            content={content}
            onChange={onChange}
        />
    )
}