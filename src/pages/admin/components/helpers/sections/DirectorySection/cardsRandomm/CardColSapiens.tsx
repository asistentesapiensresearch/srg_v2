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
      className="block no-underline group"
    >
      <div className="relative w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#710707] via-[#5c0303] to-[#3a0000] shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_48px_rgba(0,0,0,0.6)] aspect-auto flex flex-col">
        
        {/* Background image overlay */}
        {portada && (
          <div className="absolute inset-0 z-0">
            <img
              src={portada}
              alt={nombre}
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            />
          </div>
        )}
        
        {/* Dark/red gradient overlay to blend image */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-[#450101]/60 to-[#2e0000] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-5 lg:p-6">
          
          {/* Top Row: Badges */}
          <div className="flex justify-end gap-2 mb-6">
            {categoria && (
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl px-4 py-1.5 shadow-md border border-red-500/30">
                <span className="text-xl lg:text-2xl font-black leading-none tracking-tight">D{categoria}</span>
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-90 mt-0.5">Categoría</span>
              </div>
            )}
            
            {calificacion && (
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 text-yellow-950 rounded-xl px-4 py-1.5 shadow-md border border-yellow-300/40">
                <span className="text-xl lg:text-2xl font-black leading-none tracking-tight">{calificacion}</span>
                <span className="text-[9px] font-bold tracking-widest uppercase opacity-80 mt-0.5">Calificación</span>
              </div>
            )}
          </div>

          {/* Middle Row: Stars, Name, Location */}
          <div className="flex-1 flex flex-col justify-center mb-6">
            <div className="mb-3">
              <StartSection
                excelSource=""
                stars={stars}
                typePage="admin"
                size={24}
                gap={4}
              />
            </div>
            
            <h3 className="text-white text-xl lg:text-2xl font-bold leading-tight tracking-tight mb-2 text-shadow-md">
              {nombre}
            </h3>
            
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <DynamicIcon name="MapPin" size={14} className="opacity-80" />
              <span className="truncate">
                {ciudad}{departamento ? ` - ${departamento}` : ""}
              </span>
            </div>
          </div>

          {/* Bottom Row: Testimonial Box */}
          <div className="mt-auto">
            <div className="bg-[#240000]/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 lg:p-5 flex items-center gap-4 shadow-inner">
              
              {/* Photo & Logo */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-white/20 shadow-lg bg-gray-600">
                  {rectorPhoto ? (
                    <img src={rectorPhoto} alt={rectorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-600" />
                  )}
                </div>
                {logo && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full overflow-hidden border-2 border-[#3a0000] bg-white shadow-md">
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Testimonial Text */}
              <div className="flex flex-col flex-1">
                <p className="text-white/95 text-sm lg:text-base font-medium italic leading-snug mb-2">
                  "{rectorTestimonial}"
                </p>
                <div className="text-white/70 text-xs lg:text-sm font-semibold tracking-wide">
                  - {rectorName}, <span className="font-normal opacity-80">Rectoría</span>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </a>
  );
};