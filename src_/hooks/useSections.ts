import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

export function useSections() {

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                const sectionsDB = await apiSyncService.get('Section');
                setSections(sectionsDB.sort((a, b) => a.index - b.index));
            } catch (error) {
                console.error("Error fetching sections:", error);
            } finally {
                setLoading(false)
            }
        };
        if(!loading)
            init();
    }, []);

    return {
        loading,
        sections,
        setSections
    };
}