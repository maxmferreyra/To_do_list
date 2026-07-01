import { useState } from "react";
import { Plus } from "lucide-react";
import { card, inputCls, labelCls, pillBtnPrimary, pillBtnGhost, fmtH, taskHours } from "../lib/ui";

export default function SprintsView({ sprints, statuses, tasks, onViewTasks, onAddSprint }) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [goal, setGoal] = useState("");

  const doneStatus = statuses.find((s) => s.name.toLowerCase() === "hecho");

  function submit() {
    if (!name.trim()) return;
    onAddSprint({ name: name.trim(), start: start || null, end: end || null, goal });
    setName("");
    setStart("");
    setEnd("");
    setGoal("");
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {sprints.length === 0 && <p className="text-sm text-white/50">Todavía no creaste ningún sprint.</p>}
        {sprints.map((s) => {
          const sTasks = tasks.filter((t) => t.sprint_id === s.id);
          const done = doneStatus ? sTasks.filter((t) => t.status_id === doneStatus.id).length : 0;
          const pct = sTasks.length ? Math.round((done / sTasks.length) * 100) : 0;
          const hours = sTasks.reduce((a, t) => a + taskHours(t), 0);
          return (
            <div key={s.id} className={`${card} p-5`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-white font-medium">{s.name}</p>
                <span className="text-xs text-white/60">
                  {s.start_date || "—"} → {s.end_date || "—"}
                </span>
              </div>
              <p className="text-sm text-white/60 mb-3">{s.goal || "Sin objetivo definido"}</p>
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">
                  {done}/{sTasks.length} tareas · {fmtH(hours)}h registradas
                </span>
                <button onClick={() => onViewTasks(s.id)} className={pillBtnGhost}>
                  Ver tareas
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${card} p-5 max-w-md`}>
        <p className="text-white font-medium mb-4">Nuevo sprint</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2">
            <label className={labelCls}>Nombre</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Sprint 14" />
          </div>
          <div>
            <label className={labelCls}>Inicio</label>
            <input type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Fin</label>
            <input type="date" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <label className={labelCls}>Objetivo</label>
        <input className={`${inputCls} mb-4`} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Opcional" />
        <button onClick={submit} className={pillBtnPrimary}>
          <Plus size={16} /> Crear sprint
        </button>
      </div>
    </div>
  );
}
