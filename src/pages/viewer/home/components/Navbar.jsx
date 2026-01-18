// components/Navbar.jsx
import { Search, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#1e293b] text-white py-3 px-6 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-white p-1 rounded">
          <div className="w-6 h-6 bg-slate-800 flex items-center justify-center text-xs font-bold">S</div>
        </div>
        <span className="font-bold text-lg">Sapiens Research</span>
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <a href="#" className="border-b-2 border-white pb-1">Rankings</a>
        <a href="#" className="text-gray-300 hover:text-white transition">Consultoría</a>
        <a href="#" className="text-gray-300 hover:text-white transition">Noticias</a>
        <a href="#" className="text-gray-300 hover:text-white transition">Eventos</a>
      </div>
      <div className="flex gap-4">
        <Search size={20} className="cursor-pointer" />
        <User size={20} className="cursor-pointer" />
      </div>
    </nav>
  );
}