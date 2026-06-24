import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { fieldsSection } from "./fields";

const capitalizeFirstLetter = (value) => {
    const text = String(value || '').trim();
    return text ? text.charAt(0).toLocaleUpperCase('es-CO') + text.slice(1) : text;
};

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
            className="mb-1 font-bold text-[20px] leading-tight"
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
    typePage,
    excelSource = "COL",
    itemsHighlights = [],
}) => {

    let fieldsKeys;

    const dataExcels = useSelector((state) => state.sections.fetchData.sheets[excelSource]);

    const fields = fieldsSection.excel[excelSource];
    const hasCustomHighlights = Array.isArray(itemsHighlights) && itemsHighlights.length > 0;

    if (fields) fieldsKeys = Object.keys(fields);

    const renderFieldsKeys =
    typePage !== "investigation"
        ? (fieldsKeys ?? []).filter((key) => key !== "icfes ind")
        : [];

    const total =
    hasCustomHighlights
        ? itemsHighlights.length
        : typePage === "investigation"
        ? itemsHighlights?.length ?? 0
        : renderFieldsKeys.length;

    const desktopCols = total <= 8 ? total : Math.ceil(total / 2);

    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
            }}
            className="bg-primary"
        >
            <Box
                className="w-full max-w-[1440px] mx-auto md:w-[90%] grid grid-cols-2 gap-px bg-white/20"
                sx={{
                    gridTemplateColumns: {
                    md: `repeat(${desktopCols || 1}, minmax(0, 1fr))`,
                    },
                }}
            >
                {
                    hasCustomHighlights && itemsHighlights.map((el) => {
                        return container(`${el.label}-${el.value}`, el.label, el.value);
                    })
                }
                {
                    !hasCustomHighlights && typePage != "investigation" && dataExcels && fieldsKeys && fieldsKeys.length > 0 && fieldsKeys.map((key) => {
                        if (key === 'icfes ind') return null;
                        const isIcfes = key === 'icfes cat' || key === 'icfes';
                        const labelParts = [
                            dataExcels.data[fields[key]],
                            isIcfes ? dataExcels.data[fields['icfes ind']] : undefined
                        ];
                        if(!labelParts) return;
                        const label = labelParts
                            .filter(Boolean)
                            .map(v => String(v))
                            .join(" | ");

                        const tag = isIcfes ? "Categoría | Índice" : capitalizeFirstLetter(key);

                        return container(key, label, tag);
                    })
                }
                {
                    !hasCustomHighlights && typePage == "investigation"  && itemsHighlights && itemsHighlights.length > 0 && itemsHighlights.map((el) => {
                        return container(`${el.label}-${el.value}`, el.label, el.value);
                    })
                }
            </Box>
        </Box>
    )
}

export default InstitutionHighlights
