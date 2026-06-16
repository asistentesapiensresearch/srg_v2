import DynamicIcon from "../../../builder/helpers/DynamicIcon";

const ResourcesNavSection = ({ resources }) => {
  if (!resources || resources.length === 0) return null;

  const [featured, ...rest] = resources;

  if (!featured) return null;

  return (
    <section className="w-full px-4 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <p className="text-xs font-semibold tracking-widest text-red-700 uppercase flex items-center gap-2 mb-2">
          <span className="inline-block w-6 h-px bg-red-700" />
          Explora
        </p>

        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2">
          Recursos y análisis
        </h2>

        <p className="text-sm text-gray-500 max-w-xl">
          Accede a los informes, metodología y análisis de las instituciones
          educativas más destacadas de Colombia.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Featured card */}
        <a
          href={featured.url_resource}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-2xl bg-red-700 text-white p-6 no-underline transition-all duration-300 hover:bg-red-800 hover:shadow-xl"
        >
          <div className="mb-4 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <DynamicIcon name={featured.icon} color="#fff" size={20} />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
            {featured.category || "Informe anual"}
          </p>

          <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
            {featured.label}
          </h3>

          <p className="text-sm text-white/75 leading-relaxed flex-1">
            {featured.description}
          </p>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center gap-3">
            <div className="relative inline-flex items-center group/cta">
              <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center transition-transform duration-200 group-hover/cta:scale-110 group-hover/cta:bg-white/40 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>

              <span
                className="absolute left-11 top-1/2 -translate-y-1/2 border border-white/30 text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 pointer-events-none transition-all duration-150 group-hover/cta:opacity-100 group-hover/cta:left-10"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {featured.cta || "Conocer más"}
              </span>
            </div>

            <span className="text-sm font-semibold text-white">
              {featured.cta || "Ver reporte"}
            </span>
          </div>
        </a>

        {/* Rest of cards */}
        {rest.map((el, index) => (
          <a
            key={`resource_${index}`}
            href={el.url_resource}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl bg-white border border-gray-200 p-6 no-underline transition-all duration-300 hover:shadow-md hover:border-gray-300"
          >
            <div className="mb-4 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <DynamicIcon name={el.icon} color="#c00007" size={20} />
            </div>

            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              {el.category || "Recurso"}
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
              {el.label}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed flex-1">
              {el.description}
            </p>

            <div className="mt-6 relative inline-flex items-center group/cta">
              <div className="w-9 h-9 rounded-full bg-red-700 flex items-center justify-center transition-transform duration-200 group-hover/cta:scale-110 group-hover/cta:bg-red-800 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>

              <span className="absolute left-11 top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-gray-500 text-xs px-2.5 py-1 rounded-md whitespace-nowrap shadow-sm opacity-0 pointer-events-none transition-all duration-150 group-hover/cta:opacity-100 group-hover/cta:left-10">
                {el.cta || "Conocer más"}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ResourcesNavSection;