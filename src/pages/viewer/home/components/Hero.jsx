// components/Hero.jsx
export default function Hero() {
    return (
        <section className="flex flex-col md:flex-row justify-between items-center gap-6 py-6">
            <div className="max-w-md">
                <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
                    La métrica de la calidad educativa
                </h1>
                <p className="text-gray-400 mt-2 italic">Donec sat me iarrco liokistias</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button className="bg-[#1d4e89] text-white px-8 py-4 rounded-md font-bold flex items-center justify-center gap-2 shadow-lg">
                    <span className="text-xl">🏛</span> IES & COLEGIOS
                </button>
                <button className="bg-white text-gray-600 px-8 py-4 rounded-md font-bold flex items-center justify-center gap-2 shadow border border-gray-100">
                    <span className="text-xl">🔗</span> PROGRAMAS ACADÉMICOS
                </button>
            </div>
        </section>
    );
}