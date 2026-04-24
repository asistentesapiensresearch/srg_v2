import { remove } from "aws-amplify/storage";
import { moveIconToDefinitiveFolder } from "./moveIconToDefinitiveFolder";


const validateFileTypeByKey = (key, allowedExtensions) => {
  if (!key) return false;

  const ext = key.split(".").pop()?.toLowerCase();

  return allowedExtensions.includes(ext);
};

export const processTempFile = async ({
  currentKey,
  oldKey,
  fileNamePrefix,
  setKey,
  errorKey = "form",
  TEMP_FOLDER,
  setErrors,
  setUploading,
  allowedExtensions = [],
}) => {
  try {
    if (!currentKey) return currentKey;
  
    if (
      allowedExtensions.length > 0 &&
      !validateFileTypeByKey(currentKey, allowedExtensions)
    ) {
      console.log({errorKey});
      setErrors({
        [errorKey]: `Formato no permitido. Solo: ${allowedExtensions.join(", ")}`,
      });
      setUploading(false);
      throw new Error(`Formato no permitido. Solo: ${allowedExtensions.join(", ")}`);
    }
  
    if (!currentKey.includes(TEMP_FOLDER)) {
      return currentKey;
    }
    const newKey = await moveIconToDefinitiveFolder(
      TEMP_FOLDER,
      currentKey,
      `${fileNamePrefix}-${Date.now()}`
    );

    setKey?.(newKey);

    if (oldKey && oldKey !== newKey) {
      await remove({ path: oldKey }).catch((e) =>
        console.warn("No se pudo borrar archivo antiguo", e)
      );
    }

    return newKey;
  } catch (error) {
    setUploading(false);
    throw error;
  }
};