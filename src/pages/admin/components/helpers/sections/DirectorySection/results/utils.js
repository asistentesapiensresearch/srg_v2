// src/view/sections/DirectorySection/results/utils.js
export const getValue = (item, keys) => {
    if (!item) return null;
    const itemKeys = Object.keys(item);
    for (const key of keys) {
        const foundKeyEquals = itemKeys.find(k => k.toLowerCase() == key.toLowerCase());
        const foundKey = foundKeyEquals ?? itemKeys.find(k => k.toLowerCase().includes(key.toLowerCase()));
        if (foundKey) return item[foundKey];
    }
    return null;
};