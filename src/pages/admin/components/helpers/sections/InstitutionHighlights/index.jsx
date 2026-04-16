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
        className="px-6 py-6"
    >
        <h4 
            style={{
                color: "#fff",
            }}
            className="mb-1 font-bold text-lg leading-tight"
        >
            {label}
        </h4>
        <span 
            style={{
                color: "#ffcdd2", // A softer light red/pink for the tag text
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                fontWeight: "500",
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
    const fields = fieldsSection.excel[excelSource];

    if (fields) fieldsKeys = Object.keys(fields);

    return (
        <Box
            sx={{
                bgcolor: "#C10007",
                width: "100%",
                height: "auto",
            }}
        >
            <div 
              className={`w-full max-w-[1440px] mx-auto md:w-[90%] grid grid-cols-1 sm:grid-cols-2 ${fieldsKeys?.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'} divide-y sm:divide-y-0 sm:divide-x divide-white/20`}
            >
                {
                    dataExcels && fieldsKeys && fieldsKeys.length > 0 && fieldsKeys.map((key) => {
                        const label = dataExcels.data[fields[key]] ? String(dataExcels.data[fields[key]]).toUpperCase() : "";
                        return container(key, label, key.toUpperCase());
                    })
                }
            </div>
        </Box>
    )
}

export default InstitutionHighlights
