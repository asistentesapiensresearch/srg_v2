import { Link } from "react-router-dom";

// components/AcademicOffer.jsx
export default function AcademicOffer() {
    return (
        <div className="bg-red-700 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <h2 className="text-2xl font-bold">Oferta Académica</h2>
            <div className="flex flex-wrap gap-3">
                <Link to="losmejorespregrados">
                    <div className="bg-white text-slate-800 px-6 py-2 rounded-md text-sm font-semibold">
                        PRE-Sapiens (Pregrados)
                    </div>
                </Link>
                <Link to="losmejorespostgrados">
                    <div className="border border-white/50 px-6 py-2 rounded-md text-sm font-semibold hover:bg-white/10 transition">
                        POST-Sapiens (Posgrados)
                    </div>
                </Link>
            </div>
        </div>
    );
}