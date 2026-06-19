import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchSheet } from "../DirectorySection/fetchSheet";
import { Box } from "@mui/material";
import { GraduationCap } from "lucide-react";



const GraduatesSection = ({
    sourceConfig,
    description,
}) => {

    const [topGraduates, setTopGraduates] = useState(null);
    const [totalGraduates, setTotalGraduates] = useState(null);
    const [descriptionTarget, setDescriptionTarget] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const sectionContainer = sectionRef.current?.closest(".section-component");
        setDescriptionTarget(sectionContainer?.querySelector(".wysiwyg-content") || null);
    }, []);

    useEffect(() => {

        if (!sourceConfig || !sourceConfig.sheetId) return;

        const fetchData = async () => {
            try {
                const rawRows = await fetchSheet(
                    sourceConfig.sheetId,
                    sourceConfig.selectedSheet,
                    sourceConfig.token
                );

                const top5 = rawRows
                            .map(item => ({
                                ...item,
                                total: Number(item["Exalumnos en el exterior"])
                            }))
                            .sort((a, b) => b.total - a.total)
                            .slice(0, 5);
                            
                const total = rawRows.reduce((acc, item) => acc + Number(item["Exalumnos en el exterior"]), 0);
                
                if(top5.length === 0 && total === 0) return;
                setTopGraduates(top5);
                setTotalGraduates(total);

            
            } catch (err) {
                console.error("Error al cargar excel:", err);
            }
        };

        fetchData();
    }, [sourceConfig]);

    return (
      <Box ref={sectionRef} className="flex flex-col justify-center gap-5">
        {description && descriptionTarget && createPortal(
          <p
            className="max-w-4xl border-l-4 border-red-700 px-4 py-2.5 text-left text-sm leading-6 text-gray-700"
            style={{ margin: "4px 0 20px" }}
          >
            {description}
          </p>,
          descriptionTarget
        )}

        <Box
          className="w-full max-w-md mx-auto"
          sx={{ pt: { xs: 0, md: 2 } }}
        >
          <Box
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            sx={{
              height: { xs: "auto", md: 400 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="flex items-center gap-2.5 px-4 py-3 text-white"
              style={{
                background: "linear-gradient(135deg, #c00002 0%, #8f0002 100%)",
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/15 shadow-sm"
              >
                <GraduationCap aria-hidden="true" size={19} strokeWidth={2.2} />
              </span>

              <div className="min-w-0 flex-1">
                <h3
                  className="text-base font-extrabold leading-tight"
                  style={{ marginBottom: 0 }}
                >
                  Egresados
                </h3>
                <p className="mt-0.5 text-[0.68rem] leading-relaxed text-white/80">
                  Principales destinos de las últimas 5/6 promociones
                </p>
              </div>

              <div className="ml-auto flex shrink-0 flex-col items-end rounded-lg border border-white/20 bg-white/15 px-2.5 py-1.5 shadow-sm">
                <span className="text-[0.52rem] font-bold uppercase tracking-[0.12em] text-white/70">
                  Total
                </span>
                <strong className="text-base font-extrabold leading-none text-white">
                  {totalGraduates ?? 0}
                </strong>
              </div>
            </div>

            <table className="h-full w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs tracking-[0.12em] text-gray-500">
                  <th className="px-3 py-2 text-left font-bold">País</th>
                  <th className="px-3 py-2 text-right font-bold">Egresados</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {topGraduates &&
                  topGraduates.map((item, index) => (
                    <tr key={index} className="transition hover:bg-red-50/40">
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

              </tbody>
            </table>
          </Box>
        </Box>

      </Box>
    );
}

export default GraduatesSection
