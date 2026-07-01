import { X } from "lucide-react";

export default function TabStrip({ openTasks, activeTaskId, onSelect, onClose }) {
  if (openTasks.length === 0) return null;
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {openTasks.map((t) => {
        const isActive = t.id === activeTaskId;
        return (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full text-sm cursor-pointer transition flex-shrink-0 ${
              isActive ? "bg-white text-blue-900" : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <span className="truncate max-w-36">{t.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(t.id);
              }}
              className={`rounded-full p-1 ${isActive ? "hover:bg-blue-900/10" : "hover:bg-white/20"}`}
              aria-label="Cerrar pestaña"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
