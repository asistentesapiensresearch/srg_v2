import React, { useEffect, useMemo, useState } from 'react'
import { fetchSheet } from '../DirectorySection/fetchSheet';

const cleanString = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

const CalificationAndCategory = ({ 
  sourceConfig, 
  filterField, 
  filterValue,
  borderColor = "#DC2626",
  innerCircleColor = "#ababab",
  textColor = "#FFFFFF",
  hoverColor = "rgba(255,255,255,0.2)",
  hoverEffect = true,
  hoverIntensity = "medium"
}) => {

  const finalInnerCircleColor = innerCircleColor || "#ababab";
  const finalBorderColor = borderColor || "#DC2626";

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);


  const calificationAndCategoryColumns = useMemo(
    () => [
      { key: 'Calificación', label: 'Calificación' },
      { key: 'Categoría sin D', label: 'Categoría' },
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
        console.log('rawRows traídas:', rawRows);

        const targetValueClean = cleanString(filterValue);

        const found = rawRows.find((row) => {
          const cell = row[filterField];
          if (cell === undefined || cell === null) return false;
          const cellClean = cleanString(cell);
          return cellClean === targetValueClean;
        });

        console.log('registro encontrado:', found);

        if (!found) {
          throw new Error(`No se encontró registro con ${filterField}="${filterValue}"`);
        }


        const calificationAndCategoryData = {};
        calificationAndCategoryColumns.forEach(({ key }) => {
          calificationAndCategoryData[key] = found[key] ?? '';
        });

        console.log('datos de calificación y categoría:', calificationAndCategoryData);

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
      small: 'hover:scale-105 hover:shadow-sm',
      medium: 'hover:scale-110 hover:shadow-md',
      large: 'hover:scale-115 hover:shadow-xl'
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

    const calificationValue = String(record['Calificación'] ?? '-');
    const categoryValue = 'D' + String(record['Categoría sin D'] ?? '-');

    const categoryScale = isHovered ? 1.2 : 1;
    const calificationScale = isHovered ? 1.1 : 1;

    return (
      <div className="flex items-center justify-center background-transparent">
        <div
          className={`relative w-40 h-40 rounded-full flex items-center justify-center text-center transition-transform duration-300 ${getHoverClasses()}`}
          style={{ backgroundColor: finalBorderColor }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-white transition-all duration-300 p-3 overflow-hidden"
            style={{
              backgroundColor: finalInnerCircleColor,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isHovered ? hoverColor : 'transparent',
                borderRadius: '9999px',
                transition: 'background 0.25s ease',
                pointerEvents: 'none'
              }}
            />
            <span
              className="text-3xl font-black drop-shadow mb-2"
              style={{
                color: textColor,
                transform: `scale(${categoryScale})`,
                transition: 'transform 0.3s ease'
              }}
            >
              {categoryValue}
            </span>
            <span
              className="text-xl font-bold drop-shadow"
              style={{
                color: textColor,
                transform: `scale(${calificationScale})`,
                transition: 'transform 0.3s ease'
              }}
            >
              {calificationValue}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[280px] float-left mr-4 mt-4 bg-transparent">
      <div className="bg-transparent rounded-xl shadow-none p-0 max-w-[280px]">
        {React.renderContent()}
      </div>
    </div>
  );
};

export default CalificationAndCategory
