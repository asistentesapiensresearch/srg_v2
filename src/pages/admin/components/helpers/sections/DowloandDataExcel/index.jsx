import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSheet } from "../DirectorySection/fetchSheet";
import { setSheetData } from "@src/store/sectionsSlice";

const cleanString = (val) => {
  if (val === null || val === undefined) return "";
  return String(val)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const DowloandDataExcel = ({
    sourceConfig,
    filterField,
    filterValue,
    identifierExcel
}) => {

    const dispatch = useDispatch();

    const excelStored = useSelector(
        (state) => state.sections.fetchData.sheets?.[identifierExcel]
    );

    useEffect(() => {
        if (!identifierExcel) return;
        if (!sourceConfig || !sourceConfig.sheetId) return;
        if (!filterField || !filterValue) return;

        if (excelStored?.data) return;

        const fetchData = async () => {
            try {
                const rawRows = await fetchSheet(
                    sourceConfig.sheetId,
                    sourceConfig.selectedSheet
                );

                const targetValueClean = cleanString(filterValue);

                const found = rawRows.filter((row) => {
                    const cell = row[filterField];
                    if (cell === undefined || cell === null) return false;
                    return cleanString(cell) === targetValueClean;
                })
                .at(-1);

                if (!found) return;
                dispatch(
                    setSheetData({
                        identifierExcel,
                        data: found,
                    })
                );
            } catch (err) {
                console.error("Error al cargar excel:", err);
            }
        };

        fetchData();
    }, [sourceConfig, filterField, filterValue, identifierExcel, dispatch, excelStored?.data]);

    return null;
}

export default DowloandDataExcel
