import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDatabaseDownload } from "@src/store/sectionsSlice";
import DataSourceManager from "@src/core/data/DataSourceManager";

const cleanObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const cleaned = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value !== "function") {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

const DowloandDataBase = ({
    modelName = "Institution",
    searchField = "name",
    searchValue = "",
}) => {

    const dispatch = useDispatch();

    useEffect(() => {

        if (!modelName || !searchField || !searchValue) return;

        const fetchDataModel = async () => {
            try {
                const { data } = await DataSourceManager.findByField(
                    modelName,
                    searchField,
                    searchValue,
                    1
                );

                const cleanData = cleanObject(data[0]);
                
                if (data && data.length > 0) {
                    dispatch(setDatabaseDownload({
                        model: modelName,
                        data: cleanData
                    }));
                } else {
                    dispatch(setDatabaseDownload({
                        model: null,
                        data: null
                    }));
                }

            } catch (error) {
                console.error("Error buscando en BD:", error);
                dispatch(setDatabaseDownload({
                    model: null,
                    data: null
                }));
            }
        };

        fetchDataModel();

    }, [modelName, searchField, searchValue, dispatch]);


    return null;
};

export default DowloandDataBase;