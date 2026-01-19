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
    await remove({ path: iconKey });

    return newKey;
};

const sanitizeName = (name) => {
    return name.toLowerCase().replace(/\s+/g, "_");
};