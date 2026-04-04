import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import { fieldsSection } from "./fields";
import { Box } from "@mui/material";
import { useMemo } from "react";

const StartSection = ({
    excelSource = "M-TOP",
    maxStars = 5,
    activeColor = "#F0C30E",
    inactiveColor = "#9CA3AF",
    size = 40,
    gap = 10,
}) => {

    const excelStored = useSelector(
        (state) => state.sections.fetchData.sheets?.[excelSource]
    );

    const data = excelStored?.data;
    const fields = fieldsSection?.[excelSource];

    const totalStars = useMemo(() => {
        if (!data || !fields?.stars) return 0;

        const rawValue = data[fields.stars];
        const parsed = Number(rawValue);

        if (Number.isNaN(parsed)) return 0;

        return Math.max(0, Math.min(parsed, maxStars));
    }, [data, fields, maxStars]);

    return (
        <Box
            sx={{
                gap: `${gap}px`,
            }}
            className="flex justify-center md:justify-start"
        >
            {Array.from({ length: maxStars }, (_, index) => {
                const isActive = index < totalStars;

                return (
                <Star
                    key={index}
                    size={size}
                    fill={isActive ? activeColor : inactiveColor}
                    color={isActive ? activeColor : inactiveColor}
                    strokeWidth={1.8}
                />
                );
            })}
        </Box>
    );
}

export default StartSection
