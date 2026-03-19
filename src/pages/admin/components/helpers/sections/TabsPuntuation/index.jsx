import React, { useEffect, useMemo, useState } from 'react'
import { fetchSheet } from '../DirectorySection/fetchSheet';
import { Atom, Globe, BookOpen, Calculator, MessageSquare } from 'lucide-react';
import { color } from 'highcharts';


// Helper de limpieza (nos ayuda a eliminar acentos y caracteres especiales para encontrar datos)
const cleanString = (val) => {
  if (val === null || val === undefined) return "";
  return String(val).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

const TabsPuntuation = ({ sourceConfig, 
  filterField, 
  filterValue, 
  textcolor = "#1f2937", 
  titleTabsPuntuation = "Tablas de puntuación", 
  HoverCardsPuntuation = 2, sizeTitleTabs = 20, 
  BackgroundCardsPuntuation = "#e0f2fe", 
  textColorCards = "#024a70" }) => {

  // Estado que guarda la fila que se encontró según el filtro
  const [record, setRecord] = useState(null);
  // mensaje de carga para mostrar al usuario que se están trayendo datos
  const [loading, setLoading] = useState(false);
  // Mensaje de error (si ocurre algún problema al leer el Google Sheet)
  const [error, setError] = useState(null);

  //UI



  // Columnas que queremos mostrar en el componente (igual a los encabezados del Excel)
  const scoreColumns = useMemo(
    () => [
      { key: 'Ciencias', label: 'Ciencias' },
      { key: 'Inglés', label: 'Inglés' },
      { key: 'Lectura', label: 'Lectura' },
      { key: 'Matemáticas', label: 'Matemáticas' },
      { key: 'Sociales', label: 'Sociales' },
    ],
    []
  );

  useEffect(() => {
    // Validación básica de configuración: necesitamos un sheetId válido y el filtro
    if (!sourceConfig || !sourceConfig.sheetId) {
      setError('No hay configuración de hoja disponible.');
      setRecord(null);
      return;
    }
    if (!filterField || !filterValue) {
      setError('No se ha definido el filtro para buscar el registro.');
      setRecord(null);
      return;
    }

    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setRecord(null);

      try {
        // fetchSheet usa el sheetId
        const rawRows = await fetchSheet(sourceConfig.sheetId, sourceConfig.selectedSheet);

        // Normalizamos para comparar de forma consistente
        const targetValue = cleanString(filterValue);

        // Buscamos la fila que coincide con el filtro
        const found = rawRows.find((row) => {
          const cell = row[filterField];
          if (cell === undefined || cell === null) return false;
          return cleanString(cell) === targetValue;
        });

        if (!found) {
          throw new Error(`No se encontró registro con ${filterField}="${filterValue}"`);
        }

        // Armamos un objeto con las columnas que nos interesan (para mostrar en las cards  de las materias)
        const puntuaciones = {};
        scoreColumns.forEach(({ key }) => {
          puntuaciones[key] = found[key] ?? '';
        });

        if (mounted) setRecord(puntuaciones);
      } catch (err) {
        if (mounted) setError(err?.message ?? 'Error al cargar datos.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [sourceConfig, filterField, filterValue, scoreColumns]);

  const renderContent = () => {
    if (loading) return <p className="text-gray-600">Cargando puntuaciones…</p>;
    if (error) return <p className="text-red-600 font-semibold">{error}</p>;
    if (!record) return <p className="text-gray-500">No hay datos para mostrar.</p>;

    const iconByLabel = {
      Ciencias: Atom,
      Inglés: MessageSquare,
      Lectura: BookOpen,
      Matemáticas: Calculator,
      Sociales: Globe,
    };

    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {scoreColumns.map(({ key, label }) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center min-w-[140px] p-6 rounded-2xl bg-white border border-gray-200 shadow-sm"
            style={{
              transition: "all 300ms ease-out"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translateY(-${HoverCardsPuntuation * 4}px)`
              e.currentTarget.style.boxShadow =
                "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            <div
              className={`text-xs font-semibold uppercase tracking-wide`}
              style={{
                color: textcolor
              }}
            >
              {label}
            </div>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div style={{ backgroundColor: `${BackgroundCardsPuntuation}` }} className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full shadow-inner">
                <div className="absolute -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  {React.createElement(iconByLabel[label] || Globe, { className: 'h-6 w-6 text-sky-600' })}
                </div>
                <div className="flex h-full w-full items-center justify-center">
                  <span style={{ color: `${textColorCards}` }} className="text-4xl font-extrabold drop-shadow-sm">
                    {record[key] ?? '-'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className='border-[#C10007] mb-4'>
        <h3 className='ml-2 font-[Roboto] font-black text-xl text-[#C10007]' style={{ fontSize: `${sizeTitleTabs}px` }}>
          {titleTabsPuntuation}
        </h3>
      </div>
      {renderContent()}
    </div>
  );
};

export default TabsPuntuation;
