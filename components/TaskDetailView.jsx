import { useState } from "react";
import { Clock, MessageSquare, AlertTriangle, Pin, Plus, Trash2 } from "lucide-react";
import { card, inputCls, labelCls, fmtH, taskHours } from "../lib/ui";

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className={`${card} p-5 mb-3`}>
      <p className="text-white font-medium text-sm mb-3 flex items-center gap-2">
        <Icon size={16} /> {title}
      </p>
      {children}
    </div>
  );
}

function PointItem({ point, onAddEntry, onToggleDone, onDeletePoint }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");
  const [desc, setDesc] = useState("");
  const total = (point.time_entries || []).reduce((a, e) => a + Number(e.hours), 0);

  function submit() {
    const h = parseFloat(hours);
    if (!h) return;
    onAddEntry({ date: date || today, hours: h, desc });
    setHours("");
    setDesc("");
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-2">
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" checked={point.done} onChange={() => onToggleDone(!point.done)} />
        <span className={`flex-1 text-sm ${point.done ? "line-through text-white/40" : "text-white/90"}`}>{point.title}</span>
        <span className="text-xs text-white/60 whitespace-nowrap">{fmtH(total)}h</span>
        <button onClick={onDeletePoint} className="p-1 rounded-lg text-white/40 hover:text-red-200 hover:bg-white/10" aria-label="Eliminar punto">
          <Trash2 size={13} />
        </button>
      </div>
      <div className="divide-y divide-white/5 mb-2">
        {(!point.time_entries || point.time_entries.length === 0) && (
          <p className="text-xs text-white/40 py-1">Sin horas registradas en este punto.</p>
        )}
        {(point.time_entries || []).map((e) => (
          <div key={e.id} className="flex items-center gap-3 py-1.5 text-xs">
            <span className="text-white/50 w-20">{e.date}</span>
            <span className="flex-1 text-white/70">{e.description || "—"}</span>
            <span className="text-white font-medium">{fmtH(e.hours)}h</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="date"
          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-white/50 w-28"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          min="0"
          step="0.25"
          placeholder="Horas"
          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-white/50 w-16"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input
          placeholder="Qué hiciste"
          className="flex-1 min-w-24 bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-white/50"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={submit} className="bg-white text-blue-900 rounded-lg px-2.5 py-1.5 hover:bg-white/90 transition">
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

export default function TaskDetailView({ task, statuses, sprints, handlers }) {
  const [newPointTitle, setNewPointTitle] = useState("");
  const [comment, setComment] = useState("");
  const [blocker, setBlocker] = useState("");
  const [note, setNote] = useState("");

  const totalHours = taskHours(task);

  function submitPoint() {
    if (!newPointTitle.trim()) return;
    handlers.addPoint(task.id, newPointTitle.trim());
    setNewPointTitle("");
  }
  function submitComment() {
    if (!comment.trim()) return;
    handlers.addComment(task.id, comment.trim());
    setComment("");
  }
  function submitBlocker() {
    if (!blocker.trim()) return;
    handlers.addBlocker(task.id, blocker.trim());
    setBlocker("");
  }
  function submitNote() {
    if (!note.trim()) return;
    handlers.addNote(task.id, note.trim());
    setNote("");
  }

  return (
    <div className="max-w-xl">
      <input
        className="w-full bg-transparent border-none text-xl font-semibold text-white outline-none mb-2 px-0"
        value={task.title}
        onChange={(e) => handlers.updateTask(task.id, "title", e.target.value)}
      />
      <textarea
        rows={2}
        className="w-full bg-transparent border-none text-sm text-white/70 outline-none resize-none mb-5 px-0"
        value={task.description || ""}
        onChange={(e) => handlers.updateTask(task.id, "description", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className={labelCls}>Estado</label>
          <select className={inputCls} value={task.status_id || ""} onChange={(e) => handlers.updateTask(task.id, "status_id", e.target.value)}>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Sprint</label>
          <select className={inputCls} value={task.sprint_id || ""} onChange={(e) => handlers.updateTask(task.id, "sprint_id", e.target.value || null)}>
            <option value="">Sin sprint</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Prioridad</label>
          <select className={inputCls} value={task.priority} onChange={(e) => handlers.updateTask(task.id, "priority", e.target.value)}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Horas estimadas</label>
          <input
            type="number"
            min="0"
            step="0.5"
            className={inputCls}
            value={task.estimated_hours}
            onChange={(e) => handlers.updateTask(task.id, "estimated_hours", parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <SectionCard icon={Clock} title={`Puntos de la tarea — ${fmtH(totalHours)}h registradas en total`}>
        {(!task.points || task.points.length === 0) && <p className="text-xs text-white/40 py-2">Todavía no agregaste puntos de trabajo.</p>}
        {(task.points || []).map((p) => (
          <PointItem
            key={p.id}
            point={p}
            onAddEntry={(entry) => handlers.addPointEntry(task.id, p.id, entry)}
            onToggleDone={(done) => handlers.togglePointDone(task.id, p.id, done)}
            onDeletePoint={() => handlers.deletePoint(task.id, p.id)}
          />
        ))}
        <div className="flex gap-2 mt-3">
          <input
            className={`${inputCls} text-xs`}
            placeholder="Nuevo punto de trabajo (ej: Revisar PR)"
            value={newPointTitle}
            onChange={(e) => setNewPointTitle(e.target.value)}
          />
          <button onClick={submitPoint} className="bg-white text-blue-900 rounded-xl px-3 py-2 hover:bg-white/90 transition">
            <Plus size={14} />
          </button>
        </div>
      </SectionCard>

      <SectionCard icon={MessageSquare} title="Comentarios">
        <div className="divide-y divide-white/10 mb-3">
          {(!task.comments || task.comments.length === 0) && <p className="text-xs text-white/40 py-2">Sin comentarios todavía.</p>}
          {(task.comments || []).map((c) => (
            <div key={c.id} className="py-2">
              <p className="text-sm text-white/85">{c.text}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{new Date(c.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${inputCls} text-xs`} placeholder="Agregar un comentario" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={submitComment} className="bg-white text-blue-900 rounded-xl px-3 py-2 hover:bg-white/90 transition">
            <Plus size={14} />
          </button>
        </div>
      </SectionCard>

      <SectionCard icon={AlertTriangle} title="Bloqueantes">
        <div className="divide-y divide-white/10 mb-3">
          {(!task.blockers || task.blockers.length === 0) && <p className="text-xs text-white/40 py-2">Sin bloqueantes.</p>}
          {(task.blockers || []).map((b) => (
            <label key={b.id} className="flex items-start gap-2 py-2 cursor-pointer">
              <input type="checkbox" checked={b.resolved} onChange={() => handlers.toggleBlocker(task.id, b.id, !b.resolved)} className="mt-1" />
              <span className={`text-sm ${b.resolved ? "line-through text-white/40" : "text-white/85"}`}>{b.text}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${inputCls} text-xs`} placeholder="Describir el bloqueante" value={blocker} onChange={(e) => setBlocker(e.target.value)} />
          <button onClick={submitBlocker} className="bg-white text-blue-900 rounded-xl px-3 py-2 hover:bg-white/90 transition">
            <Plus size={14} />
          </button>
        </div>
      </SectionCard>

      <SectionCard icon={Pin} title="Notas importantes">
        <div className="divide-y divide-white/10 mb-3">
          {(!task.notes || task.notes.length === 0) && <p className="text-xs text-white/40 py-2">Sin notas importantes.</p>}
          {(task.notes || []).map((n) => (
            <div key={n.id} className="flex items-start gap-2 py-2">
              <Pin size={13} className="text-white/60 mt-0.5" />
              <span className="text-sm text-white/85">{n.text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className={`${inputCls} text-xs`} placeholder="Algo que no te podés olvidar" value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={submitNote} className="bg-white text-blue-900 rounded-xl px-3 py-2 hover:bg-white/90 transition">
            <Plus size={14} />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
