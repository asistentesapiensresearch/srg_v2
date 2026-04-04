import { useState } from 'react'
import { useSelector } from 'react-redux';
import { fieldsSection } from './fields';

const CalificationAndCategory = ({
  excelSource = "M-TOP", 
  borderColor = "#DC2626",
  innerCircleColor = "#ababab",
  textColor = "#FFFFFF",
  hoverColor = "rgba(255,255,255,0.2)",
  hoverEffect = true,
  hoverIntensity = "medium"
}) => {

  const dataExcels = useSelector((state) => state.sections.fetchData.sheets[excelSource]);
  const fields = fieldsSection[excelSource];

  const finalInnerCircleColor = innerCircleColor || "#ababab";
  const finalBorderColor = borderColor || "#DC2626";

  const [isHovered, setIsHovered] = useState(false);

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
    /* if (loading) {
      return <div className="text-center py-4 text-gray-500">Cargando datos...</div>;
    }
    if (error) {
      return <div className="text-center py-4 text-red-500 font-semibold">Error: {error}</div>;
    }
    if (!record) {
      return <div className="text-center py-4 text-gray-400">No hay datos para mostrar.</div>;
    } */

    const calificationValue = (dataExcels) && String(dataExcels.data[fields.calificación] ?? '-');
    const categoryValue = (dataExcels) && 'D' + String(dataExcels.data[fields.categoría] ?? '-');

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
        {renderContent()}
      </div>
    </div>
  );
};

export default CalificationAndCategory
