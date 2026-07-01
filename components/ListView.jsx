import { MessageSquare, AlertTriangle, Pin, Clock, ChevronRight, Plus } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import { card, selectCls, pillBtnPrimary, fmtH, taskHours, PRIORITY_WEIGHT } from "../lib/ui";

export default function ListView({
  statuses,
  sprints,
  tasks,
  sprintFilter,
  setSprintFilter,
  statusFilter,
  setStatusFilter,
  onOpenTask,
  onNewTask,
}) {
  const filtered = tasks.filter(
    (t) => (sprintFilter === "all" || t.sprint_id === sprintFilter) && (statusFilter === "all" || t.status_id === statusFilter)
  );
  const sorted = [...filtered].sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <select value={sprintFilter} onChange={(e) => setSprintFilter(e.target.value)} className={selectCls}>
            <option value="all">Todos los sprints</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option value="all">Todos los estados</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={onNewTask} className={pillBtnPrimary}>
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      <p className="text-xs text-white/50 mb-2 px-1">Ordenadas por prioridad</p>
      <div className={`${card} divide-y divide-white/10`}>
        {sorted.length === 0 && <p className="text-sm text-white/50 p-5">No hay tareas todavía. Creá la primera con el botón de arriba.</p>}
        {sorted.map((t) => {
          const hours = taskHours(t);
          const statusName = statuses.find((s) => s.id === t.status_id)?.name || "Sin estado";
          const sprintName = sprints.find((s) => s.id === t.sprint_id)?.name || "Sin sprint";
          const openBlockers = (t.blockers || []).filter((b) => !b.resolved).length;
          return (
            <div key={t.id} onClick={() => onOpenTask(t.id)} className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition">
              <PriorityBadge priority={t.priority} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{t.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                  <span>{statusName}</span>
                  <span>·</span>
                  <span>{sprintName}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs text-white/60 flex-shrink-0">
                {(t.comments || []).length > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    {t.comments.length}
                  </span>
                )}
                {openBlockers > 0 && (
                  <span className="flex items-center gap-1 text-red-100">
                    <AlertTriangle size={12} />
                    {openBlockers}
                  </span>
                )}
                {(t.notes || []).length > 0 && (
                  <span className="flex items-center gap-1">
                    <Pin size={12} />
                    {t.notes.length}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-xs text-white/70 whitespace-nowrap flex-shrink-0">
                <Clock size={12} />
                {fmtH(hours)}h / {fmtH(t.estimated_hours)}h
              </span>
              <ChevronRight size={16} className="text-white/40 flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
