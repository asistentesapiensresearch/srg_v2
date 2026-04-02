import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDatabaseDownload } from "@src/store/sectionsSlice";
import DataSourceManager from "@src/core/data/DataSourceManager";

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


                if (data && data.length > 0) {
                    dispatch(setDatabaseDownload({
                        model: modelName,
                        data: data[0]
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