import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

export function useSections() {

    const [sections, setSections] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                const sectionsDB = await apiSyncService.get('Section');
                setSections(sectionsDB.sort((a, b) => a.index - b.index));
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };
        init();
    }, []);

    return {
        sections,
        setSections
    };
}