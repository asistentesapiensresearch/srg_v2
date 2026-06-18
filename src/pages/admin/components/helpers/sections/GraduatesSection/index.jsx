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
                    sourceConfig.selectedSheet,
                    sourceConfig.token
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
            className="flex flex-col justify-center gap-8"
        >
            <Box className="w-full max-w-md mx-auto mt-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="px-4 py-3 text-white" style={{ background: "linear-gradient(135deg, #c00002 0%, #9f0002 100%)" }}>
                        <p className="text-[10px] font-bold tracking-[0.18em] opacity-80">
                            Ranking
                        </p>
                        <h3 className="mt-0.5 text-base font-extrabold leading-tight">
                            Top 3 países
                        </h3>
                    </div>

                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs tracking-[0.12em] text-gray-500">
                                <th className="px-3 py-2 text-left font-bold">País</th>
                                <th className="px-3 py-2 text-right font-bold">Exalumnos</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {topGraduates && topGraduates.map((item, index) => (
                                <tr
                                    key={index}
                                    className="transition hover:bg-red-50/40"
                                >
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-sm"
                                                style={{ backgroundColor: "#c00002" }}
                                            >
                                                {index + 1}
                                            </span>

                                            <span className="font-bold text-gray-900">
                                                {item["Country name"]}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-3 py-3 text-right">
                                        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-extrabold text-gray-800">
                                            {item.total}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            <tr className="border-t border-red-100 bg-red-50">
                                <td className="px-3 py-3 text-left font-extrabold text-gray-900">
                                    Total de exalumnos Colegio
                                </td>

                                <td className="px-3 py-3 text-right">
                                    <span className="inline-flex min-w-12 items-center justify-center rounded-full px-3 py-1 text-sm font-extrabold text-white" style={{ backgroundColor: "#c00002" }}>
                                        {totalGraduates}
                                    </span>
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
