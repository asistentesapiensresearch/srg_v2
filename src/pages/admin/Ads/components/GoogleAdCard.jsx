
import { Pencil, Trash2 } from "lucide-react";
import GoogleAd from "./GoogleAd";

const GoogleAdCard = ({ ad, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">Ad Unit</p>
          <h3 className="font-semibold text-gray-800 break-all">
            {ad.adUnitPath}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(ad)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Pencil size={18} className="text-gray-600" />
          </button>

          <button
            onClick={() => onDelete(ad)}
            className="p-2 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Slot */}
      <div>
        <p className="text-sm text-gray-400">Slot ID</p>
        <p className="text-gray-700 text-sm break-all">{ad.slotId}</p>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            ad.enabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {ad.enabled ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Placeholder para imagen/gif */}
      <div className="mt-2 border border-dashed border-gray-300 rounded-xl  flex items-center justify-center">
        <GoogleAd
            slotId={`div-gpt-${ad.id}`}
            adUnitPath={ad.adUnitPath}
        />
      </div>
    </div>
  );
};

export default GoogleAdCard;
