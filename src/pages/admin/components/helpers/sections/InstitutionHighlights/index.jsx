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
        className="px-6 py-6 bg-primary"
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
                textTransform: "uppercase",
            }}
        >
            {tag}
        </span>
    </Box>)

const InstitutionHighlights = ({
    excelSource = "COL",
}) => {

    let fieldsKeys;

    const dataExcels = useSelector((state) => state.sections.fetchData.sheets[excelSource]);
    const fields = fieldsSection.excel[excelSource];

    if (fields) fieldsKeys = Object.keys(fields);

    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
            }}
            className="bg-primary"
        >
            <div 
              className={`w-full max-w-[1440px] mx-auto md:w-[90%] grid grid-cols-2 ${fieldsKeys?.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-6'} gap-[1px] bg-white/20`}
            >
                {
                    dataExcels && fieldsKeys && fieldsKeys.length > 0 && fieldsKeys.map((key) => {
                        if (key === 'icfes ind') return null;

                        const isIcfes = key === 'icfes cat' || key === 'icfes';
                        
                        const labelParts = [
                            dataExcels.data[fields[key]],
                            isIcfes ? dataExcels.data[fields['icfes ind']] : undefined
                        ];

                        const label = labelParts
                            .filter(Boolean)
                            .map(v => String(v).toUpperCase())
                            .join(" | ");

                        const tag = isIcfes ? "ICFES" : key;

                        return container(key, label, tag);
                    })
                }
            </div>
        </Box>
    )
}

export default InstitutionHighlights
