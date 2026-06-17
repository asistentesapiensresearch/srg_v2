import { remove, copy } from "aws-amplify/storage";

export const moveIconToDefinitiveFolder = async (TEMP_FOLDER, iconKey, name) => {
    if (!iconKey.startsWith(TEMP_FOLDER)) {
        return iconKey;
    }

    const sanitized = sanitizeName(name);
    const newKey = iconKey.replace("temp/", `${sanitized}/`);

    await copy({
        source: { path: iconKey },
        destination: { path: newKey }
    });
    await remove({ path: iconKey }).catch((error) => {
        console.warn("No se pudo borrar el archivo temporal después de copiarlo:", error);
    });

    return newKey;
};

const sanitizeName = (name) => {
    return String(name || "file")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "_")
        .replace(/^_+|_+$/g, "") || "file";
};
