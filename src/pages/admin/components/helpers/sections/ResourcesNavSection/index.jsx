import DynamicIcon from "../../../builder/helpers/DynamicIcon";

const ResourcesNavSection = ({ resources, sizeIcon, colorIcon }) => {
  if (!resources || resources.length === 0) return null;

  const [featured, ...rest] = resources;

  return (
    <section className="w-full px-4 py-12 ">
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
          Accede a los informes, metodología y análisis de las instituciones educativas más destacadas de Colombia.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Featured card (first item) — red background */}
        <a
          href={featured.url_resource}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-2xl bg-red-700 text-white p-6 no-underline transition-all duration-300 hover:bg-red-800 hover:shadow-xl"
        >
          {/* Icon */}
          <div className="mb-4 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <DynamicIcon name={featured.icon} color="#fff" size={20} />
          </div>

          {/* Category label */}
          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
            {featured.category || "Informe anual"}
          </p>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
            {featured.label}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/75 leading-relaxed flex-1">
            {featured.description}
          </p>

          {/* Divider + CTA */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <span className="text-sm font-semibold text-white flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
              {featured.cta || "Ver reporte"}
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>

        {/* Rest of cards — white background */}
        {rest.map((el, index) => (
          <a
            key={`resource_${index}`}
            href={el.url_resource}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl bg-white border border-gray-200 p-6 no-underline transition-all duration-300 hover:shadow-md hover:border-gray-300"
          >
            {/* Icon */}
            <div className="mb-4 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <DynamicIcon name={el.icon} color="#c00007" size={20} />
            </div>

            {/* Category label */}
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              {el.category || "Recurso"}
            </p>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
              {el.label}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed flex-1">
              {el.description}
            </p>

            {/* CTA */}
            <div className="mt-6">
              <span className="text-sm font-semibold text-red-700 flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                {el.cta || "Conocer más"}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ResourcesNavSection;