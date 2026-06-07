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
  const fieldsExcel = fieldsSection.excel?.[excelSource];

  const mergedData = useMemo(() => {
    const logo = data?.[fieldsDB?.logo] || "";
    const excelData = dataExcels?.data || {};
    const rankingValue = String(excelData?.[fieldsExcel?.ranking] ?? "-");

    const recentValue = String(excelData?.[fieldsExcel?.reciente] ?? "-");

    const totalVersions = String(excelData?.[fieldsExcel?.versiones] ?? "-");

    const sinceValue = String(excelData?.[fieldsExcel?.desde] ?? "-");
    let totalStars = 0;
    if (excelData && fieldsExcel?.stars) {
      const rawValue = excelData[fieldsExcel.stars];
      const parsed = Number(rawValue);
      if (!Number.isNaN(parsed)) {
        totalStars = Math.max(0, Math.min(parsed, maxStars));
      }
    }

    return {
      logo,
      rankingValue,
      recentValue,
      totalVersions,
      sinceValue,
      totalStars,
    };
  }, [data, dataExcels, fieldsExcel, fieldsDB, maxStars]);

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

      <div className="relative w-[210px] h-[300px] md:w-[280px] md:h-[390px] animate-glow-pulse group">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="160 20 360 510"
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
            y="83"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="2"
            opacity="0.9"
          >
            RANKING COL-SAPIENS
          </text>
          <text
            x="340"
            y="125"
            textAnchor="middle"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize="15.5"
            fontWeight="900"
            fill="#ffffff"
            letterSpacing="8"
          >
            {mergedData.countryValue}
          </text>
          <text
            x="340"
            y="100"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fontWeight="600"
            fill="#ffcccc"
            letterSpacing="3"
            opacity="0.85"
          >
            {mergedData.dateValue}
          </text>

          <g transform="translate(0, 8)">
            {/* Categoría fondo — imagen letra_logos.png opacidad baja */}
            <image
              href={letraLogos}
              x="215"
              y="210"
              width="250"
              height="80"
              preserveAspectRatio="xMidYMid meet"
              opacity="0.06"
            />

            {/* Categoría principal — imagen letra_logos.png con hover */}
            <image
              href={letraLogos}
              x="215"
              y="210"
              width="250"
              height="80"
              preserveAspectRatio="xMidYMid meet"
              className="transition-transform duration-300 group-hover:scale-110"
              style={{ transformOrigin: "340px 248px" }}
            />

            {/* Líneas decorativas */}
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

            {/* Logo Sapiens centrado entre las dos líneas */}
            <image
              href={logoSapiens}
              x="310"
              y="155"
              width="80"
              height="55"
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

            <text
              x="340"
              y="315"
              textAnchor="middle"
              fontFamily="Arial Black, Arial, sans-serif"
              fontSize="22"
              fontWeight="900"
              fill="#ffffff"
              letterSpacing="4"
              className="transition-transform duration-300 group-hover:scale-105"
              style={{ transformOrigin: "340px 308px" }}
            >
              {mergedData.calificationValue}
            </text>

            <line
              x1="215"
              y1="334"
              x2="316"
              y2="334"
              stroke="#CC0000"
              strokeWidth="1"
              opacity="0.25"
            />
            <polygon
              points="340,328 347,334 340,340 333,334"
              fill="#CC0000"
              opacity="0.4"
            />
            <line
              x1="364"
              y1="334"
              x2="465"
              y2="334"
              stroke="#CC0000"
              strokeWidth="1"
              opacity="0.25"
            />

            {/* Contenedor CLASIFICADO */}
            <g
              className="transition-transform duration-300 hover:-translate-y-1"
              style={{ transformOrigin: "340px 370px" }}
            >
              <rect
                x="248"
                y="348"
                width="184"
                height="62"
                rx="6"
                ry="18"
                fill="#CC0000"
              />
              <rect
                x="250"
                y="350"
                width="180"
                height="58"
                rx="5"
                ry="16"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.15"
              />
              <text
                x="340"
                y="365"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="11.5"
                fontWeight="700"
                fill="#ffaaaa"
                letterSpacing="3"
              >
                VERSIÓN
              </text>
              <line
                x1="240"
                y1="370"
                x2="440"
                y2="370"
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <text
                x="340"
                y="384"
                textAnchor="middle"
                fontFamily="Arial Black, Arial, sans-serif"
                fontSize="15.5"
                fontWeight="900"
                fill="#ffffff"
                letterSpacing="2"
              >
                #{mergedData.totalVersions}
              </text>
              <text
                x="340"
                y="399"
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

          <polyline
            points="170,80 170,50 208,40"
            fill="none"
            stroke="#CC0000"
            strokeWidth="2.5"
          />
          <polyline
            points="510,80 510,50 472,40"
            fill="none"
            stroke="#CC0000"
            strokeWidth="2.5"
          />
          <circle cx="208" cy="40" r="3" fill="#CC0000" />
          <circle cx="472" cy="40" r="3" fill="#CC0000" />
        </svg>
      </div>
    </div>
  );
};

export default CalificationAndCategory;
