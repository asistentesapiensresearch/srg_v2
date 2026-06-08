import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fieldsSection } from "./fields";
import { Star } from "lucide-react";
import { useImageUrl } from "@src/hooks/useImageUrl";
import letraLogos from "../../../../../../assets/images/letras_logo.png";
import logoSapiens from "../../../../../../assets/images/logo_sapiens.png";

const CalificationAndCategory = ({ excelSource = "Rk-ver", maxStars = 5 }) => {
  const { model, data } = useSelector((state) => state.sections.fetchData.databaseDownload);
  const dataExcels = useSelector((state) => state.sections.fetchData.sheets?.[excelSource]);
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

          <line
            x1="190"
            y1="80"
            x2="230"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="220"
            y1="80"
            x2="260"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="250"
            y1="80"
            x2="290"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="280"
            y1="80"
            x2="320"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="310"
            y1="80"
            x2="350"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="340"
            y1="80"
            x2="380"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="370"
            y1="80"
            x2="410"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="400"
            y1="80"
            x2="440"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="430"
            y1="80"
            x2="470"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />
          <line
            x1="460"
            y1="80"
            x2="500"
            y2="135"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.1"
            clipPath="url(#shieldClip)"
          />

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

          <text
            x="340"
            y="98"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="2"
            opacity="0.9"
          >
            {mergedData.rankingValue}
          </text>
          <text
            x="340"
            y="118"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="15.5"
            fontWeight="600"
            fill="#ffcccc"
            letterSpacing="3"
            opacity="0.85"
          >
            {mergedData.recentValue}
          </text>

          <g transform="translate(0, 8)">
            {/* Líneas decorativas — definen el centro y=175 */}
            <line
              x1="182"
              y1="175"
              x2="282"
              y2="175"
              stroke="#CC0000"
              strokeWidth="2"
            />
            <line
              x1="398"
              y1="175"
              x2="498"
              y2="175"
              stroke="#CC0000"
              strokeWidth="2"
            />
            <circle cx="282" cy="175" r="3" fill="#CC0000" />
            <circle cx="398" cy="175" r="3" fill="#CC0000" />

            {/* Logo Sapiens — centrado en x=340, y=175 */}
            <image
              href={logoSapiens}
              x="285"
              y="137"
              width="110"
              height="76"
              preserveAspectRatio="xMidYMid meet"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" }}
            />

            {/* Logo del equipo — encima del logoSapiens, mismo centro */}
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

            {/* letraLogos — debajo del logo, centrado, con margen */}
            <image
              href={letraLogos}
              x="235"
              y="222"
              width="210"
              height="60"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Separador con diamante */}
            <line
              x1="215"
              y1="295"
              x2="316"
              y2="295"
              stroke="#CC0000"
              strokeWidth="1"
              opacity="0.25"
            />
            <polygon
              points="340,289 347,295 340,301 333,295"
              fill="#CC0000"
              opacity="0.4"
            />
            <line
              x1="364"
              y1="295"
              x2="465"
              y2="295"
              stroke="#CC0000"
              strokeWidth="1"
              opacity="0.25"
            />

            {/* Contenedor VERSIÓN */}
            <g
              className="transition-transform duration-300 hover:-translate-y-1"
              style={{ transformOrigin: "340px 351px" }}
            >
              <rect
                x="248"
                y="324"
                width="184"
                height="62"
                rx="6"
                ry="18"
                fill="#CC0000"
              />
              <rect
                x="250"
                y="326"
                width="180"
                height="58"
                rx="5"
                ry="16"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.15"
              />
              <line
                x1="240"
                y1="338"
                x2="440"
                y2="338"
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <text
                x="340"
                y="348"
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
                y="368"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="11.5"
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