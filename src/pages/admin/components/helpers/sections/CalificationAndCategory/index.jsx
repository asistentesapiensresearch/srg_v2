import React, { useEffect, useMemo, useState } from 'react'
import { fetchSheet } from '../DirectorySection/fetchSheet';
import { Star, Tag } from 'lucide-react';

const cleanString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

const CalificationAndCategory = ({ 
  sourceConfig, 
  filterField, 
  filterValue,
  titleColor = "#C10007",
  iconColor = "#EF4444",
  circleColor = "#DC2626",
  largeCircleColor = "#ababab",
  textColor = "#FFFFFF",
  hoverEffect = true,
  hoverIntensity = "medium"
}) => {

  const finalLargeCircleColor = largeCircleColor || "#ababab";

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const calificationAndCategoryColumns = useMemo(
    () => [
      { key: 'Calificación', label: 'Calificación' },
      { key: 'Categoría', label: 'Categoría' },
    ],  
    []
  );

  useEffect(() => {
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

        const rawRows = await fetchSheet(sourceConfig.sheetId, sourceConfig.selectedSheet);

        const targetValueClean = cleanString(filterValue);

        const found = rawRows.find((row) => {
          const cell = row[filterField];
          if (cell === undefined || cell === null) return false;
          const cellClean = cleanString(cell);
          return cellClean === targetValueClean;
        });

        if (!found) {
          throw new Error(`No se encontró registro con ${filterField}="${filterValue}"`);
        }


        const calificationAndCategoryData = {};
        calificationAndCategoryColumns.forEach(({ key }) => {
          calificationAndCategoryData[key] = found[key] ?? '';
        });

        if (mounted) setRecord(calificationAndCategoryData);
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
  }, [sourceConfig, filterField, filterValue, calificationAndCategoryColumns]);

  const getHoverClasses = () => {
    if (!hoverEffect) return '';
    
    const hoverMap = {
      none: '',
      small: 'transform hover:-translate-y-0.25 hover:shadow-md',
      medium: 'transform hover:-translate-y-0.5 hover:shadow-lg',
      large: 'transform hover:-translate-y-1 hover:shadow-xl'
    };
    
    return hoverMap[hoverIntensity] || hoverMap.medium;
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-4 text-gray-500">Cargando datos...</div>;
    }
    if (error) {
      return <div className="text-center py-4 text-red-500 font-semibold">Error: {error}</div>;
    }
    if (!record) {
      return <div className="text-center py-4 text-gray-400">No hay datos para mostrar.</div>;
    }

    const iconByLabel = {
      Calificación: Star,
      Categoría: Tag,
    };

    return (
      <div className="grid grid-cols-1 gap-2">
        {calificationAndCategoryColumns.map(({ key, label }) => {
          const value = String(record[key] ?? '-');
          const Icon = iconByLabel[label];

          return (
            <div key={key} className={`relative p-2 bg-transparent border border-white/15 backdrop-blur-sm rounded-lg transition text-white max-w-[260px] ${getHoverClasses()}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  {Icon && <Icon className="h-4 w-4" style={{ color: iconColor }} />}
                  <span className="text-[11px] font-semibold uppercase tracking-wider drop-shadow" style={{ color: textColor }}>{label}</span>
                </div>
                <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: circleColor, color: textColor }}>
                  {key === 'Calificación' ? '★' : <Tag className="h-4 w-4" />}
                </div>
              </div>

              <div className="flex items-center justify-center h-16 rounded-lg bg-white/10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-inner backdrop-blur-sm px-1" style={{ backgroundColor: finalLargeCircleColor }}>
                  <span className="text-sm font-bold drop-shadow whitespace-nowrap overflow-hidden text-ellipsis text-center" style={{ color: textColor }}>{value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-[280px] float-left mr-4 mt-4 bg-transparent">
      <div className='border-l-4 mb-2 pl-3 bg-transparent' style={{ borderLeftColor: titleColor }}>
        <h3 className='font-[Roboto] font-black text-xs uppercase tracking-wider opacity-80' style={{ color: titleColor }}>Categoría y Calificación</h3>
      </div>
      <div className="bg-transparent rounded-xl shadow-none p-0 max-w-[280px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default CalificationAndCategory
