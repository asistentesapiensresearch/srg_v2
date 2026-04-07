import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { fieldsSection } from "./fields";


const container = (key, label, tag) =>  (
    <Box
        key={key}
        sx={{
            width: "100%",
            height: "100%",
            textAlign: "center",
        }}
        className="px-10 py-4 border-gray-50 border-b-1 md:border-b-0 md:border-r-1"
    >
        <h4 
            style={{
                color: "#fff",
            }}
            className="mb-0 font-bold">{label}</h4>
        <span 
            style={{
                color: "#ccc",
            }}
        >
            {tag}
        </span>
    </Box>)

const InstitutionHighlights = ({
    excelSource,
}) => {


    let fieldsKeys;

    const dataExcels = useSelector((state) => state.sections.fetchData.sheets[excelSource]);
    const fields = fieldsSection[excelSource];

    if (fields) fieldsKeys = Object.keys(fields);

    return (
        <Box
            sx={{
                bgcolor: "#C10007",
                width: "100%",
                height: "auto",
            }}
            className="flex flex-col md:flex-row justify-between items-center"
        >
            {
                dataExcels && fieldsKeys && fieldsKeys.length > 0 && fieldsKeys.map((key) => {
                    const label = dataExcels.data[fields[key]].toUpperCase();
                    return container(key, label, key.toUpperCase());
                })
            }
        </Box>
    )
}

export default InstitutionHighlights
