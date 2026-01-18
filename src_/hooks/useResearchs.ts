import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

export function useResearchs() {

    const [loading, setLoading] = useState(false);
    const [researchs, setResearchs] = useState([]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const researchsDB = await apiSyncService.get('Research');
                setResearchs(researchsDB.sort((a, b) => a.index - b.index));
            } catch (error) {
                console.error("Error fetching reserachs:", error);
            } finally {
                setLoading(false);
            }
        };
        if (!loading) init();
    }, []);

    return {
        loading,
        researchs,
        setResearchs
    };
}