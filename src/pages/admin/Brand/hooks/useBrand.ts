import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";
import { copy, remove } from "aws-amplify/storage";
import { BrandAmplifyRepository } from "@core/infrastructure/repositories/BrandAmplifyRepository";
import { Store } from "@core/application/caseUses/Brand";

export function useBrand() {

    const [refresh, setRefresh] = useState(0);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                const brandsDB = await apiSyncService.get('Brand');
                setBrands(brandsDB.sort((a, b) => a.index - b.index));
            } catch (error) {
                console.error("Error fetching brands:", error);
            } finally {
                setLoading(false)
            }
        };
        if (!loading)
            init();
    }, [refresh]);

    const saveBrand = async (data: {
        iconKey: string,
        tempFolder: string,
        name: string,
        link: string,
        brand: any
    }) => {
        const { iconKey, tempFolder, name, link, brand } = data;
        let finalKey = iconKey;

        // Mover icono a carpeta definitiva
        if (iconKey.startsWith(tempFolder)) {
            const sanitized = name.toLowerCase().replace(/\s+/g, "_");
            const newKey = iconKey.replace("temp/", `${sanitized}/`);
            await copy({
                source: { path: iconKey },
                destination: { path: newKey }
            });
            await remove({ path: iconKey });
            finalKey = newKey;
        }

        // Si estamos editando y el ícono cambió (y no es el temporal), borramos el anterior
        if (brand?.id && brand.key && brand.key !== finalKey) {
            await remove({ path: brand.key });
        }

        // Guardar en tu backend o DataStore
        const newData = {
            name: name,
            link: link,
            key: finalKey,
        };

        const repository = new BrandAmplifyRepository();
        const command = new Store(repository);
        return await command.execute(newData, brand?.id);
    }
    return {
        loading,
        brands,
        saveBrand,
        setBrands,
        setRefresh
    };
}