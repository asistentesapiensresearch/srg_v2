import React, { useMemo } from 'react'
import { Atom, Globe, BookOpen, Calculator, MessageSquare, Map, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { fieldsSection } from './fields';


const TabsPuntuation = ({ 
  excelSource = "Micro-Posionamiento",
  textcolor = "#1f2937", 
  titleTabsPuntuation, 
  HoverCardsPuntuation = 2, 
}) => {

  const excelStored = useSelector(
    (state) => state.sections.fetchData.sheets?.[excelSource]
  );

  const data = excelStored?.data;
  const fields = fieldsSection.excel?.[excelSource];

  const scoreColumns = useMemo(() => {
     if (!data || !fields) return [];

    return [
      { key: "ciencias", label: "ciencias", puntuations: { regional: data[fields.d_ciencias], country: data[fields.ciencias] } },
      { key: "ingles", label: "Inglés", puntuations: { regional: data[fields.d_ingles], country: data[fields.ingles] } },
      { key: "lectura", label: "Lectura", puntuations: { regional: data[fields.d_lectura], country: data[fields.lectura] } },
      { key: "matematicas", label: "Matemáticas", puntuations: { regional: data[fields.d_matematicas], country: data[fields.matematicas] } },
      { key: "sociales", label: "Sociales", puntuations: { regional: data[fields.d_sociales], country: data[fields.sociales] } },
    ];
  }, [fields, data]);

  const city = useMemo(() => {
     if (!data || !fields) return [];

    return data[fields.ciudad]
  }, [fields, data]);

  const renderContent = () => {
    if (!scoreColumns) return <p className="text-gray-500">No hay datos para mostrar.</p>;

    const iconByLabel = {
      Ciencias: Atom,
      Inglés: MessageSquare,
      Lectura: BookOpen,
      Matemáticas: Calculator,
      Sociales: Globe,
    };

    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {scoreColumns.map(({ key, label, puntuations }) => (
          <div
            key={key}
            className="group min-w-[140px] rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm"
            style={{
              transition: "all 300ms ease-out",
              borderTop: "3px solid var(--color-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translateY(-${HoverCardsPuntuation * 2}px)`;
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#F5F5F5",
                }}
              >
                {React.createElement(iconByLabel[label] || Globe, {
                  className: "h-6 w-6 text-gray-500",
                })}
              </div>

              <h3
                className="text-center font-bold tracking-wide text-base"
                style={{ color: textcolor }}
              >
                {label}
              </h3>

              <div className="mt-4 grid w-full grid-cols-2 gap-2.5">
                <div
                  className="flex h-11 items-center justify-center rounded-xl border text-lg font-extrabold"
                  style={{
                    backgroundColor: "#EAF3FF",
                    borderColor: "rgba(27, 97, 165, 0.16)",
                    color: "#1B61A5",
                  }}
                >
                  <span>{puntuations.country ?? "-"}</span>
                </div>

                <div
                  className="flex h-11 items-center justify-center rounded-xl border text-lg font-extrabold"
                  style={{
                    backgroundColor: "#FDEEEF",
                    borderColor: "rgba(193, 0, 7, 0.14)",
                    color: "var(--color-primary)",
                  }}
                >
                  <span>{puntuations.regional ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <div className="">
        <h4 className="font-black">{titleTabsPuntuation}</h4>
        <div
          className="mt-8 flex flex-row flex-wrap gap-5 pb-4"
          style={{ color: "black" }}
        >
          <p
            className="flex items-center gap-2 h-11 justify-center rounded-xl border text-sm font-bold p-3"
            style={{
              backgroundColor: "#EAF3FF",
              borderColor: "rgba(27, 97, 165, 0.16)",
              color: "#1B61A5",
            }}
          >
            <Map size={16} color="#1B61A5" strokeWidth={2.4} />
            Colombia
          </p>
          <p
            className="flex items-center gap-2  h-11 justify-center rounded-xl border text-sm font-bold p-3"
            style={{
              backgroundColor: "#FDEEEF",
              borderColor: "rgba(193, 0, 7, 0.14)",
              color: "var(--color-primary)",
            }}
          >
            <MapPin size={16} color="var(--color-primary)" strokeWidth={2.4} />
            {city}
          </p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default TabsPuntuation;
