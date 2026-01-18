import { useEffect, useState } from "react";

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

    useEffect(() => {
        console.log('newSections:',sections);
    }, [sections]);

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