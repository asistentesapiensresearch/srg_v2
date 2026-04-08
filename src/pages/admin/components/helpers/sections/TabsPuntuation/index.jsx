import React, { useEffect, useMemo, useState } from 'react'
import { fetchSheet } from '../DirectorySection/fetchSheet';
import { Atom, Globe, BookOpen, Calculator, MessageSquare } from 'lucide-react';
import { color } from 'highcharts';
import { useSelector } from 'react-redux';
import { fieldsSection } from './fields';


// Helper de limpieza (nos ayuda a eliminar acentos y caracteres especiales para encontrar datos)
const cleanString = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

const TabsPuntuation = ({ 
  excelSource = "Micro-Posionamiento",
  textcolor = "#1f2937", 
  titleTabsPuntuation, 
  HoverCardsPuntuation = 2, sizeTitleTabs = 20, 
  BackgroundCardsPuntuation = "#e0f2fe", 
  textColorCards = "#024a70" }) => {

  const excelStored = useSelector(
    (state) => state.sections.fetchData.sheets?.[excelSource]
  );

  const data = excelStored?.data;
  const fields = fieldsSection?.[excelSource];

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
              borderTop: "3px solid #C10008"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translateY(-${HoverCardsPuntuation * 2}px)`;
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(0,0,0,0.1)";
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
                className="text-center text-sm font-bold uppercase tracking-wide"
                style={{ color: textcolor }}
              >
                {label}
              </h3>

              <div className="mt-5 grid w-full grid-cols-2 gap-3">
                <div
                  className="flex h-[54px] items-center justify-center rounded-2xl text-2xl font-extrabold"
                  style={{
                    backgroundColor: "#EAF3FF",
                    color: "#1B61A5",
                  }}
                >
                  {puntuations.regional ?? "-"}
                </div>

                <div
                  className="flex h-[54px] items-center justify-center rounded-2xl text-2xl font-extrabold"
                  style={{
                    backgroundColor: "#FDEEEF",
                    color: "#C10008",
                  }}
                >
                  {puntuations.country ?? "-"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      width: "90%",
      margin: "20px auto"
    }}>
      <div className=''>
        <h3 className='font-black underline' style={{ fontSize: `${sizeTitleTabs}px` }}>
          {titleTabsPuntuation}
        </h3>
        <div className='mt-8 flex flex-row gap-5' style={{color: "black"}}>
          <p> <span style={{display: "inline-block", width: "10px", height: "10px", backgroundColor: "#1B61A5", borderRadius: "50%"}}></span> Nacional</p>
          <p> <span style={{display: "inline-block", width: "10px", height: "10px", backgroundColor: "#C10008", borderRadius: "50%"}}></span> {city}</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default TabsPuntuation;
