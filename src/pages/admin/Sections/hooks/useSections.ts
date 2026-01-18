import { useEffect, useState } from "react";

import { apiSyncService } from "@core/infrastructure/api/apiSync.service";
import { copy, remove } from "aws-amplify/storage";

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
        if (!loading)
            init();
    }, []);

    const saveSection = async (data: {
        iconKey: string,
        tempFolder: string,
        name: string,
        description: string,
        color: string,
        section: any
    }) => {
        const { tempFolder, name, description, color, iconKey, section } = data;
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
        if (section?.id && section.icon && section.icon !== finalKey) {
            await remove({ path: section.icon });
        }

        // Guardar en tu backend o DataStore
        const newData = {
            name,
            description,
            color,
            icon: iconKey,
        };

        const repository = new SectionAmplifyRepository();

        if (section?.id) {
            const command = new Update(repository);
            return await command.execute(section.id, newData);
        }

        const command = new Create(repository);
        return await command.execute(newData);
    }

    return {
        loading,
        sections,
        saveSection,
        setSections
    };
}