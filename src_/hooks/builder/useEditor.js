import { useState } from "react";

export function useEditor() {
    const [openSections, setOpenSections] = useState(false);
    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);

    const toggleSectionDrawer =
        (newOpen) =>
            (event) => {
                if (event && event.type === 'keydown' && ((event).key === 'Tab' || (event).key === 'Shift')) {
                    return;
                }

                setOpenSections(newOpen);
            };

    return {
        sections,
        openSections,
        selectedSectionId,
        setSections,
        setOpenSections,
        toggleSectionDrawer,
        setSelectedSectionId
    }
}