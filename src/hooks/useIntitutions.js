import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";
import { copy, remove } from "aws-amplify/storage";
import { LogoAmplifyRepository } from "@core/infrastructure/repositories/BrandAmplifyRepository";
import { Create, Update } from "@core/application/caseUses/Brand";

export function useInstitutions() {

    const [refresh, setRefresh] = useState(0);
    const [institutions, setInstitutions] = useState([]);
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
        if (!loading) init();
    }, [refresh]);

    const saveLogo = async (data: {
        iconKey: string,
        tempFolder: string,
        name: string,
        link: string,
        logo: any
    }) => {
        let finalKey = data.iconKey;

        // Mover icono a carpeta definitiva
        if (data.iconKey.startsWith(data.tempFolder)) {
            const sanitized = data.name.toLowerCase().replace(/\s+/g, "_");
            const newKey = data.iconKey.replace("temp/", `${sanitized}/`);
            await copy({
                source: { path: data.iconKey },
                destination: { path: newKey }
            });
            await remove({ path: data.iconKey });
            finalKey = newKey;
        }

        // Si estamos editando y el ícono cambió (y no es el temporal), borramos el anterior
        if (data.logo?.id && data.logo.key && data.logo.key !== finalKey) {
            await remove({ path: data.logo.key });
        }

        // Guardar en tu backend o DataStore
        const newData = {
            name: data.name,
            link: data.link,
            key: finalKey,
        };

        const repository = new LogoAmplifyRepository();

        if (data.logo?.id) {
            const command = new Update(repository);
            return await command.execute(data.logo.id, newData);
        }

        const command = new Create(repository);
        return await command.execute(newData);
    }
    return {
        loading,
        logos,
        saveLogo,
        setLogos,
        setRefresh
    };
}