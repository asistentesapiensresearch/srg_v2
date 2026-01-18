// src/view/sections/DirectorySection/results/EmptyState.tsx
export const EmptyState = () => {
    return (
        <div className="text-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                🔍
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No encontramos resultados
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Intenta ajustar tu búsqueda o limpiar los filtros para ver más opciones.
            </p>
            {/* Opcional: Un botón para limpiar todo aquí mismo mejora mucho la UX */}
        </div>
    );
};