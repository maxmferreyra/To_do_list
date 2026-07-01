import { supabase } from "./supabaseClient";

export async function fetchData() {
  const [{ data: statuses, error: e1 }, { data: sprints, error: e2 }, { data: tasksRaw, error: e3 }] = await Promise.all([
    supabase.from("statuses").select("*").order("position", { ascending: true }),
    supabase.from("sprints").select("*").order("start_date", { ascending: true }),
    supabase.from("tasks").select(`
      id, title, description, status_id, sprint_id, priority, estimated_hours, created_at,
      points:task_points(id, title, done, position, time_entries(id, date:entry_date, hours, description)),
      comments(id, text, created_at),
      blockers(id, text, resolved, created_at),
      notes(id, text, created_at)
    `),
  ]);

  if (e1) throw e1;
  if (e2) throw e2;
  if (e3) throw e3;

  const tasks = (tasksRaw || []).map((t) => ({
    ...t,
    points: (t.points || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((p) => ({
        ...p,
        time_entries: (p.time_entries || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1)),
      })),
    comments: (t.comments || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
  }));

  return { statuses: statuses || [], sprints: sprints || [], tasks };
}

export async function createTask(payload) {
  const { error } = await supabase.from("tasks").insert(payload);
  if (error) throw error;
}

export async function updateTask(id, field, value) {
  const { error } = await supabase
    .from("tasks")
    .update({ [field]: value })
    .eq("id", id);
  if (error) throw error;
}

export async function addPoint(taskId, title) {
  const { error } = await supabase.from("task_points").insert({ task_id: taskId, title, position: Date.now() });
  if (error) throw error;
}

export async function addPointEntry(pointId, entry) {
  const { error } = await supabase.from("time_entries").insert({
    point_id: pointId,
    entry_date: entry.date,
    hours: entry.hours,
    description: entry.desc || "",
  });
  if (error) throw error;
}

export async function togglePointDone(pointId, done) {
  const { error } = await supabase.from("task_points").update({ done }).eq("id", pointId);
  if (error) throw error;
}

export async function deletePoint(pointId) {
  const { error } = await supabase.from("task_points").delete().eq("id", pointId);
  if (error) throw error;
}

export async function addComment(taskId, text) {
  const { error } = await supabase.from("comments").insert({ task_id: taskId, text });
  if (error) throw error;
}

export async function addBlocker(taskId, text) {
  const { error } = await supabase.from("blockers").insert({ task_id: taskId, text });
  if (error) throw error;
}

export async function toggleBlocker(blockerId, resolved) {
  const { error } = await supabase.from("blockers").update({ resolved }).eq("id", blockerId);
  if (error) throw error;
}

export async function addNote(taskId, text) {
  const { error } = await supabase.from("notes").insert({ task_id: taskId, text });
  if (error) throw error;
}

export async function addSprint(payload) {
  const { error } = await supabase.from("sprints").insert({
    name: payload.name,
    start_date: payload.start || null,
    end_date: payload.end || null,
    goal: payload.goal || "",
  });
  if (error) throw error;
}

export async function addStatus(name) {
  const { error } = await supabase.from("statuses").insert({ name, position: Date.now() });
  if (error) throw error;
}

export async function updateStatusPosition(id, position) {
  const { error } = await supabase.from("statuses").update({ position }).eq("id", id);
  if (error) throw error;
}

export async function deleteStatus(id) {
  const { error } = await supabase.from("statuses").delete().eq("id", id);
  if (error) throw error;
}
