import { List, Rocket, CalendarDays, Settings2 } from "lucide-react";

const TABS = [
  { id: "board", label: "Tareas", icon: List },
  { id: "sprints", label: "Sprints", icon: Rocket },
  { id: "summary", label: "Resumen del día", icon: CalendarDays },
  { id: "statuses", label: "Estados", icon: Settings2 },
];

export default function NavBar({ active, onSelect }) {
  return (
    <div className="flex justify-center sm:justify-start mb-4">
      <div className="flex items-center gap-1 bg-white/15 backdrop-blur-xl border border-white/25 rounded-full p-1.5 shadow-lg shadow-blue-900/10">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                isActive ? "bg-white text-blue-900 shadow-sm" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
