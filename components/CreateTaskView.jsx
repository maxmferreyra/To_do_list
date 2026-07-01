import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { card, inputCls, labelCls, pillBtnPrimary, pillBtnGhost } from "../lib/ui";

export default function CreateTaskView({ statuses, sprints, onCancel, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState(statuses[0]?.id || "");
  const [sprintId, setSprintId] = useState("");
  const [priority, setPriority] = useState("media");
  const [estimated, setEstimated] = useState(2);

  function submit() {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description,
      status_id: statusId || null,
      sprint_id: sprintId || null,
      priority,
      estimated_hours: parseFloat(estimated) || 0,
    });
  }

  return (
    <div>
      <button onClick={onCancel} className={`${pillBtnGhost} mb-5`}>
        <ArrowLeft size={16} /> Volver
      </button>
      <div className={`${card} p-6 max-w-lg`}>
        <label className={labelCls}>Título</label>
        <input className={`${inputCls} mb-4`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Arreglar bug en login" />
        <label className={labelCls}>Descripción</label>
        <textarea
          rows={3}
          className={`${inputCls} mb-4 resize-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalle de la tarea"
        />
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className={labelCls}>Estado</label>
            <select className={inputCls} value={statusId} onChange={(e) => setStatusId(e.target.value)}>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sprint</label>
            <select className={inputCls} value={sprintId} onChange={(e) => setSprintId(e.target.value)}>
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
            <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Horas estimadas</label>
            <input type="number" min="0" step="0.5" className={inputCls} value={estimated} onChange={(e) => setEstimated(e.target.value)} />
          </div>
        </div>
        <button onClick={submit} className={pillBtnPrimary}>
          <Check size={16} /> Crear tarea
        </button>
      </div>
    </div>
  );
}
