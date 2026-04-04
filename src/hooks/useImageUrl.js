import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

export const useImageUrl = (path) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      if (!path) {
        setUrl("");
        return;
      }

      try {
        if (
          path.startsWith("institutions/") ||
          path.startsWith("builder/") ||
          path.startsWith("sections/")
        ) {
          const result = await getUrl({ path });
          setUrl(result.url.toString());
        } else {
          setUrl(path);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setUrl("");
      }
    };

    loadImage();
  }, [path]);

  return url;
};