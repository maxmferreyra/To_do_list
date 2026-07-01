import { card, selectCls, fmtH } from "../lib/ui";

export default function SummaryView({ tasks, summaryDate, setSummaryDate }) {
  const entries = [];
  tasks.forEach((t) => {
    (t.points || []).forEach((p) => {
      (p.time_entries || []).forEach((e) => {
        if (e.date === summaryDate) entries.push({ task: t, point: p, entry: e });
      });
    });
  });
  const total = entries.reduce((a, x) => a + Number(x.entry.hours), 0);
  const taskCount = new Set(entries.map((x) => x.task.id)).size;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm text-white/70">Fecha</label>
        <input type="date" value={summaryDate} onChange={(e) => setSummaryDate(e.target.value)} className={selectCls} />
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-md mb-6">
        <div className={`${card} p-4`}>
          <p className="text-xs text-white/60 mb-1">Horas trabajadas</p>
          <p className="text-2xl font-semibold text-white">{fmtH(total)}h</p>
        </div>
        <div className={`${card} p-4`}>
          <p className="text-xs text-white/60 mb-1">Tareas tocadas</p>
          <p className="text-2xl font-semibold text-white">{taskCount}</p>
        </div>
      </div>
      <div className={`${card} p-5 max-w-xl`}>
        {entries.length === 0 && <p className="text-sm text-white/50">No registraste horas este día.</p>}
        <div className="divide-y divide-white/10">
          {entries.map((x, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-white">{x.task.title}</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {x.point.title}
                  {x.entry.description ? " · " + x.entry.description : ""}
                </p>
              </div>
              <span className="text-sm font-medium text-white whitespace-nowrap ml-4">{fmtH(x.entry.hours)}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
