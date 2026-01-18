import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";

export function useLogo() {

    const [logos, setLogos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                const logosDB = await apiSyncService.get('Logo');
                setLogos(logosDB.sort((a, b) => a.index - b.index));
            } catch (error) {
                console.error("Error fetching logos:", error);
            } finally {
                setLoading(false)
            }
        };
        if(!loading)
            init();
    }, []);

    return {
        loading,
        logos,
        setLogos
    };
}