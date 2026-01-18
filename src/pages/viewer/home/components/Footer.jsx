// components/Footer.jsx
export default function Footer() {
    const columns = [
        { title: "Productos", items: ["Conducties"] },
        { title: "Servicios", items: ["Inactionqualids de instlet"] },
        { title: "Servicios", items: ["Fordaite de 1.5/322"] },
        { title: "Legal", items: ["Restricios de nostras", "Raodiscad on olders"] },
    ];

    return (
        <footer className="bg-white border-t border-gray-100 mt-12 pt-12 pb-8 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
                {columns.map((col, idx) => (
                    <div key={idx} className="space-y-4">
                        <h5 className="font-bold text-gray-400 text-xs uppercase tracking-widest">{col.title}</h5>
                        <ul className="space-y-2">
                            {col.items.map((item, i) => (
                                <li key={i} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Newsletter */}
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <h5 className="font-bold text-slate-800 text-sm">Newsletter</h5>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs text-gray-500">
                            <input type="checkbox" className="rounded text-blue-600" /> Unis
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-500">
                            <input type="checkbox" className="rounded text-blue-600" /> Colegios
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email..."
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}