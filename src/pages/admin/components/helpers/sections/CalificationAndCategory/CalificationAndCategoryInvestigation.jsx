import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fieldsSection } from "./fields";
import { Star } from "lucide-react";
import { useImageUrl } from "@src/hooks/useImageUrl";
import letraLogos from "../../../../../../assets/images/letras_logo.png";
import logoSapiens from "../../../../../../assets/images/logo_sapiens.png";

const CalificationAndCategory = ({ excelSource = "Rk-ver", maxStars = 5 }) => {
  const { model, data } = useSelector(
    (state) => state.sections.fetchData.databaseDownload,
  );
  const dataExcels = useSelector(
    (state) => state.sections.fetchData.sheets?.[excelSource],
  );
  const fieldsDB = fieldsSection.db?.[model];

  const mergedData = useMemo(() => {
    const logo = data?.[fieldsDB?.logo] || "";

    const excelRow = dataExcels?.data?.[0] || {};

    const rankingValue = excelRow?.Ranking ?? "";
    const recentValue = excelRow?.Reciente ?? "";
    const totalVersions = excelRow?.Versiones ?? "";
    const sinceValue = excelRow?.Desde ?? "";

    let totalStars = Number(excelRow?.Stars ?? 0);

    if (Number.isNaN(totalStars)) {
      totalStars = 0;
    }

    totalStars = Math.max(0, Math.min(totalStars, maxStars));

    return {
      logo,
      rankingValue,
      recentValue,
      totalVersions,
      sinceValue,
      totalStars,
    };
  }, [data, dataExcels, fieldsDB, maxStars]);

  const logoUrl = useImageUrl(mergedData.logo) || "";

  const getStarTransform = (index) => {
    const transforms = [
      "translateY(12px) rotate(-15deg)",
      "translateY(4px) rotate(-7deg)",
      "translateY(0px) rotate(0deg)",
      "translateY(4px) rotate(7deg)",
      "translateY(12px) rotate(15deg)",
    ];
    return transforms[index] || "none";
  };

  return (
<div className="w-full md:w-[300px] md:float-left md:mr-6 mt-6 bg-transparent flex flex-col items-center">
  {/* Estrellas — todas amarillas y brillando */}
  <div className="flex items-end justify-center mb-0 z-10 gap-1.5 h-12">
    {Array.from({ length: maxStars }, (_, index) => (
      <div
        key={index}
        style={{
          transform: getStarTransform(index),
          transition: "all 0.3s ease",
        }}
      >
        <Star
          size={38}
          fill="#F0C30E"
          color="#F0C30E"
          strokeWidth={1}
          className="drop-shadow-[0_0_10px_rgba(240,195,14,0.85)]"
        />
      </div>
    ))}
  </div>

  <style>
    {`
      @keyframes glow-pulse {
        0%, 100% {
          filter: drop-shadow(0 15px 15px rgba(204, 0, 0, 0.4));
          transform: scale(1);
        }
        50% {
          filter: drop-shadow(0 0 35px rgba(230, 20, 20, 1));
          transform: scale(1.05);
        }
      }
      .animate-glow-pulse {
         animation: glow-pulse 5s infinite ease-in-out;
      }
    `}
  </style>

  <div className="relative w-[210px] h-[275px] md:w-[280px] md:h-[360px] animate-glow-pulse group">
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="160 20 360 490"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="shieldClip">
          <path d="M340,30 L510,80 L510,320 Q510,445 340,508 Q170,445 170,320 L170,80 Z" />
        </clipPath>

        <filter id="toWhite" x="0%" y="0%" width="100%" height="100%">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1 0"
          />
        </filter>
      </defs>

      <path
        d="M340,36 L514,84 L514,322 Q514,449 340,513 Q166,449 166,322 L166,84 Z"
        fill="#CC0000"
        opacity="0.12"
      />
      <path
        d="M340,30 L510,80 L510,320 Q510,445 340,508 Q170,445 170,320 L170,80 Z"
        fill="#ffffff"
      />
      <path
        d="M340,30 L510,80 L510,135 L170,135 L170,80 Z"
        fill="#CC0000"
        clipPath="url(#shieldClip)"
      />

      {/* Líneas decorativas de la franja superior */}
      <line x1="190" y1="80" x2="230" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="220" y1="80" x2="260" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="250" y1="80" x2="290" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="280" y1="80" x2="320" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="310" y1="80" x2="350" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="340" y1="80" x2="380" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="370" y1="80" x2="410" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="400" y1="80" x2="440" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="430" y1="80" x2="470" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />
      <line x1="460" y1="80" x2="500" y2="135" stroke="#ffffff" strokeWidth="1" opacity="0.1" clipPath="url(#shieldClip)" />

      <path
        d="M170,430 Q170,445 200,462 L340,508 L480,462 Q510,445 510,430 L510,415 L170,415 Z"
        fill="#CC0000"
        opacity="0.06"
        clipPath="url(#shieldClip)"
      />

      <path
        d="M340,30 L510,80 L510,320 Q510,445 340,508 Q170,445 170,320 L170,80 Z"
        fill="none"
        stroke="#CC0000"
        strokeWidth="4"
      />
      <path
        d="M340,44 L498,88 L498,320 Q498,433 340,492 Q182,433 182,320 L182,88 Z"
        fill="none"
        stroke="#CC0000"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Logo letraLogos superior — letras blancas */}
      <image
        href={letraLogos}
        x="210"
        y="48"
        width="260"
        height="78"
        preserveAspectRatio="xMidYMid meet"
        clipPath="url(#shieldClip)"
        filter="url(#toWhite)"
      />

      <g transform="translate(0, 8)">

        {/* Logo Sapiens */}
        <image
          href={logoSapiens}
          x="285"
          y="137"
          width="110"
          height="76"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }}
        />

        {/* Logo del equipo */}
        {logoUrl && (
          <image
            href={logoUrl}
            x="302"
            y="137"
            width="76"
            height="76"
            preserveAspectRatio="xMidYMid meet"
            style={{
              filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.15))",
              transformOrigin: "340px 175px",
            }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Bloque de texto centrado entre logo y separador */}
        {/* Zona entre y=220 (fin logo) y y=302 (separador) → centro en y=261 */}
        {/* Título: dominantBaseline="middle" centra verticalmente sobre su y */}

        {/* Línea decorativa superior del bloque */}
        <line x1="200" y1="232" x2="480" y2="232" stroke="#CC0000" strokeWidth="0.8" opacity="0.2" />

        {/* Título principal */}
        <text
          x="340"
          y="252"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="18"
          fontWeight="900"
          fill="#CC0000"
          letterSpacing="1.5"
        >
          RANKING
        </text>
        <text
          x="340"
          y="275"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="18"
          fontWeight="900"
          fill="#CC0000"
          letterSpacing="1.5"
        >
          COL-SAPIENS
        </text>

        {/* Línea divisoria entre título y subtítulo */}
        <line x1="240" y1="287" x2="440" y2="287" stroke="#CC0000" strokeWidth="0.8" opacity="0.25" />

        {/* Subtítulo temporada */}
        <text
          x="340"
          y="300"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="#999999"
          letterSpacing="1.5"
        >
        2024–2025
        </text>
        {/* Separador con diamante */}
        <line x1="215" y1="325" x2="316" y2="325" stroke="#CC0000" strokeWidth="1" opacity="0.25" />
        <polygon points="340,319 347,325 340,331 333,325" fill="#CC0000" opacity="0.4" />
        <line x1="364" y1="325" x2="465" y2="325" stroke="#CC0000" strokeWidth="1" opacity="0.25" />

        {/* Contenedor VERSIÓN */}
        <g
          className="transition-transform duration-300 hover:-translate-y-1"
          style={{ transformOrigin: "340px 375px" }}
        >
          <rect x="248" y="352" width="184" height="62" rx="6" ry="18" fill="#CC0000" />
          <rect x="250" y="354" width="180" height="58" rx="5" ry="16" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.15" />
          <line x1="240" y1="366" x2="440" y2="366" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" />
          <text
            x="340"
            y="376"
            textAnchor="middle"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="15.5"
            fontWeight="900"
            fill="#ffffff"
            letterSpacing="2"
          >
            VERSIÓN {mergedData.totalVersions}
          </text>
          <text
            x="340"
            y="396"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="13"
            fontWeight="700"
            fill="#ffaaaa"
            letterSpacing="2"
          >
            DESDE {mergedData.sinceValue}
          </text>
        </g>
      </g>
    </svg>
  </div>
</div>
  );
};

export default CalificationAndCategory;
