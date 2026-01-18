// components/AcademicOffer.jsx
export default function AcademicOffer() {
    return (
        <div className="bg-[#6d28d9] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <h2 className="text-2xl font-bold">Oferta Académica</h2>
            <div className="flex flex-wrap gap-3">
                <button className="bg-white text-slate-800 px-6 py-2 rounded-md text-sm font-semibold">
                    PRE-Sapiens (Pregrados)
                </button>
                <button className="border border-white/50 px-6 py-2 rounded-md text-sm font-semibold hover:bg-white/10 transition">
                    POST-Sapiens (Posgrados)
                </button>
                <button className="text-white/80 text-sm underline px-2">Leer más</button>
            </div>
        </div>
    );
}