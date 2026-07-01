export const PRIORITY_WEIGHT = { alta: 0, media: 1, baja: 2 };

export function fmtH(n) {
  const r = Math.round(Number(n || 0) * 10) / 10;
  return r % 1 === 0 ? r.toFixed(0) : r.toFixed(1);
}

export function taskHours(t) {
  return (t.points || []).reduce((a, p) => a + (p.time_entries || []).reduce((b, e) => b + Number(e.hours), 0), 0);
}

export const card = "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl";
export const inputCls =
  "w-full bg-white/10 border border-white/25 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/60 focus:bg-white/15 transition";
export const labelCls = "block text-xs text-white/60 mb-1.5";
export const pillBtnPrimary =
  "bg-white text-blue-900 font-medium rounded-full px-4 py-2 text-sm flex items-center gap-1.5 hover:bg-white/90 transition shadow-md shadow-blue-900/20";
export const pillBtnGhost =
  "bg-white/10 border border-white/25 text-white rounded-full px-4 py-2 text-sm flex items-center gap-1.5 hover:bg-white/20 transition";
export const selectCls =
  "bg-white/10 border border-white/25 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-white/60";
