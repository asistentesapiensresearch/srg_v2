import { useEffect, useState } from "react";
import { fetchSheet } from "../DirectorySection/fetchSheet";
import { Box } from "@mui/material";



const GraduatesSection = ({
    sourceConfig,
    description,
}) => {

    const [topGraduates, setTopGraduates] = useState(null);
    const [totalGraduates, setTotalGraduates] = useState(null);

    useEffect(() => {

        if (!sourceConfig || !sourceConfig.sheetId) return;

        const fetchData = async () => {
            try {
                const rawRows = await fetchSheet(
                    sourceConfig.sheetId,
                    sourceConfig.selectedSheet
                );

                const top3 = rawRows
                            .map(item => ({
                                ...item,
                                total: Number(item["Exalumnos en el exterior"])
                            }))
                            .sort((a, b) => b.total - a.total)
                            .slice(0, 3);
                            
                const total = rawRows.reduce((acc, item) => acc + Number(item["Exalumnos en el exterior"]), 0);
                
                if(top3.length === 0 && total === 0) return;
                setTopGraduates(top3);
                setTotalGraduates(total);

            
            } catch (err) {
                console.error("Error al cargar excel:", err);
            }
        };

        fetchData();
    }, [sourceConfig]);

    return (
        <Box 
            className="flex flex-col justify-center gap-8 py-6 "
        >
            <Box className="w-full max-w-md mx-auto mt-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    
                    {/* Header */}
                    <div className=" text-white text-center py-3 font-semibold" style={{backgroundColor: "#c00002"}}>
                    Top 3 Países
                    </div>

                    {/* Table */}
                    <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                        <th className="py-2 px-3 text-left">País</th>
                        <th className="py-2 px-3 text-center">Exalumnos</th>
                        </tr>
                    </thead>

                    <tbody>
                        {topGraduates && topGraduates.map((item, index) => (
                            <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="py-3 px-3 flex items-center text-center gap-2 font-bold">
                                <span className="text-xs font-bold text-white w-6 h-6 flex items-center justify-center rounded-full" style={{backgroundColor: "#c00002"}}>
                                    {index + 1}
                                </span>

                                {item["Country name"]}
                                </td>

                                <td className="py-3 px-3 text-center font-semibold text-gray-700">
                                {item.total}
                                </td>
                            </tr>
                        ))}
                        {/* 🔥 FILA TOTAL */}
                        <tr className="border-t-2 text-white font-bold" style={{backgroundColor: "#c00002"}}>
                            <td className="py-3 px-3 text-left">
                            Total de exalumnos Colegio
                            </td>

                            <td className="py-3 px-3 text-center text-white" style={{backgroundColor: "#c00002"}}>
                                {totalGraduates}
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </Box>

            <p className="text-justify">{description}</p>

        </Box>
    )
}

export default GraduatesSection
