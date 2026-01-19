import { useEffect, useState } from "react";
import { copy, remove } from "aws-amplify/storage";
import { BrandAmplifyRepository } from "@core/infrastructure/repositories/BrandAmplifyRepository";
import { Store, Get } from "@core/application/caseUses/Brand";

export function useBrand() {

    const repository = new BrandAmplifyRepository();
    const [refresh, setRefresh] = useState(0);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const command = new Get(repository);
                const brandsDB = await command.execute();
                setBrands(brandsDB.sort((a, b) => parseInt(`${a.index}`) - parseInt(`${b.index}`)));
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
        name: string,
        link: string,
        brand: any
    }) => {
        const { iconKey, name, link, brand } = data;
        // Guardar en tu backend o DataStore
        const newData = {
            name: name,
            link: link,
            key: iconKey,
        };

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