export default function PriorityBadge({ priority }) {
  const map = {
    alta: "bg-red-400/25 text-red-50 border-red-300/30",
    media: "bg-amber-400/25 text-amber-50 border-amber-300/30",
    baja: "bg-white/15 text-white/70 border-white/20",
  };
  const label = { alta: "Alta", media: "Media", baja: "Baja" }[priority] || priority;
  return <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${map[priority] || map.baja}`}>{label}</span>;
}
