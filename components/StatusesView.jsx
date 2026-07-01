import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import { card, inputCls, pillBtnPrimary } from "../lib/ui";

export default function StatusesView({ statuses, onMove, onDelete, onAdd }) {
  const [name, setName] = useState("");
  function submit() {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  }
  return (
    <div>
      <div className="space-y-2 max-w-md mb-5">
        {statuses.map((s, i) => (
          <div key={s.id} className={`${card} flex items-center justify-between px-4 py-2.5`}>
            <span className="text-white text-sm">{s.name}</span>
            <div className="flex gap-1">
              <button
                disabled={i === 0}
                onClick={() => onMove(s.id, -1)}
                className="p-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Subir"
              >
                <ChevronUp size={14} />
              </button>
              <button
                disabled={i === statuses.length - 1}
                onClick={() => onMove(s.id, 1)}
                className="p-1.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Bajar"
              >
                <ChevronDown size={14} />
              </button>
              <button onClick={() => onDelete(s.id)} className="p-1.5 rounded-lg text-red-200 hover:bg-white/10" aria-label="Eliminar">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 max-w-md">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del estado" />
        <button onClick={submit} className={`${pillBtnPrimary} whitespace-nowrap`}>
          <Plus size={16} /> Agregar
        </button>
      </div>
    </div>
  );
}
