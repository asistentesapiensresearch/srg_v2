import { useImageUrl } from "@src/hooks/useImageUrl";
import StartSection from "../../StartsSection";
import DynamicIcon from "@src/pages/admin/components/builder/helpers/DynamicIcon";

export const CardColSapiens = ({ props }) => {
  const logo = useImageUrl(props?.logo) || "";
  const portada = useImageUrl(props?.portadaPhoto) || "";
  const rectorPhoto = useImageUrl(props?.rectorPhoto) || "";

  const ciudad = props["Ciudad"] || "";
  const departamento = props["Departamento"] || "";
  const categoria = props["Categoría"] || "";
  const calificacion = props["Calificación"] || "";
  const nombre = props["Colegios"] || props["Nombre"] || "Sin nombre";
  const stars = props["Stars"];
  const path = props.path || "#";
  const rectorName = props.rectorName || "";
  // Added rectorTestimonial as requested
  const rectorTestimonial = props.rectorTestimonial || "No hay testimonio disponible.";

  return (
    <a
      href={path}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline group h-full"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-linear-to-br from-gray-800 via-gray-900 to-black shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_48px_rgba(0,0,0,0.6)] aspect-auto flex flex-col">
        {/* Background image overlay */}
        {portada && (
          <div className="absolute inset-0 z-0">
            <img
              src={portada}
              alt={nombre}
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
          </div>
        )}

        {/* Dark/red gradient overlay to blend image */}
        <div className="absolute inset-0 z-1 bg-linear-to-b from-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-5 lg:p-6">
          {/* Top Row: Badges */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="min-h-12 flex items-center">
              {stars ? (
                <StartSection
                  excelSource=""
                  stars={stars}
                  typePage="admin"
                  size={21}
                  gap={3}
                />
              ) : null}
            </div>

            <div className="flex justify-end gap-2">
              {categoria && (
                <div className="flex flex-col items-center justify-center bg-linear-to-br from-red-600 to-red-800 text-white rounded-xl px-4 py-1.5 shadow-md border border-red-500/30">
                  <span className="text-xl lg:text-[20px] font-black leading-none tracking-tight">
                    D{categoria}
                  </span>
                  <span className="text-[11px] tracking-widest opacity-90 mt-0.5 font-semibold">
                    Categoría
                  </span>
                </div>
              )}

              {calificacion && (
                <div className="flex flex-col items-center justify-center bg-linear-to-br from-yellow-500 via-yellow-400 to-yellow-600 text-yellow-950 rounded-xl px-4 py-1.5 shadow-md border border-yellow-300/40">
                  <span className="text-xl lg:text-[20px] font-black leading-none tracking-tight">
                    {calificacion}
                  </span>
                  <span className="text-[11px] tracking-widest opacity-80 mt-0.5 font-semibold">
                    Calificación
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end mb-2">
            <h3 className="text-white text-xl lg:text-[20px] font-bold leading-tight tracking-tight text-shadow-md">
              {nombre}
            </h3>

            <div className="flex items-center gap-1.5 text-white/80 text-[15px] mb-2">
              <DynamicIcon name="MapPin" size={12} className="opacity-80" />
              <span className="truncate">
                {ciudad}
                {departamento ? ` - ${departamento}` : ""}
              </span>
            </div>
          </div>

          {/* Bottom Row: Testimonial Box */}
          <div className="mt-auto pt-8 lg:pt-10">
            <div className="relative border-2 backdrop-blur-xs border-[#ffffff85] rounded-2xl px-4 pb-4 pt-10 lg:px-5 lg:pb-5 lg:pt-12 flex flex-col shadow-inner">
              {/* Top: Photo & Name (Overlapping border) */}
              <div className="absolute -top-8 lg:-top-10 left-0 lg:left-1 flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-[3px] border-white/20 shadow-lg bg-gray-600">
                    {rectorPhoto ? (
                      <img
                        src={rectorPhoto}
                        alt={rectorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600" />
                    )}
                  </div>
                  {logo && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-[#3a0000] bg-white shadow-md">
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {/* Name */}
                <h3 className="text-white text-sm lg:text-base font-semibold tracking-wide drop-shadow-md mt-8 lg:mt-12">
                  — {rectorName}
                </h3>
              </div>

              {/* Testimonial Container */}
              <div className="flex flex-col">
                {/* Testimonial Text */}
                <div>
                  <p className="text-white/95 text-[15px] lg:text-[17px] font-medium leading-snug">
                    “ {rectorTestimonial}”.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
