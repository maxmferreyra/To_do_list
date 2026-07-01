"use client";

import { useEffect, useState, useCallback } from "react";
import NavBar from "./NavBar";
import TabStrip from "./TabStrip";
import ListView from "./ListView";
import SprintsView from "./SprintsView";
import SummaryView from "./SummaryView";
import StatusesView from "./StatusesView";
import CreateTaskView from "./CreateTaskView";
import TaskDetailView from "./TaskDetailView";
import * as api from "../lib/api";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskApp() {
  const [statuses, setStatuses] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState("board");
  const [sprintFilter, setSprintFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openTaskIds, setOpenTaskIds] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [creatingTask, setCreatingTask] = useState(false);
  const [summaryDate, setSummaryDate] = useState(todayStr());

  const load = useCallback(async () => {
    try {
      const data = await api.fetchData();
      setStatuses(data.statuses);
      setSprints(data.sprints);
      setTasks(data.tasks);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con la base de datos. Revisá las variables de entorno de Supabase.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleNav(tab) {
    setView(tab);
    setActiveTaskId(null);
    setCreatingTask(false);
  }
  function openTask(id) {
    setOpenTaskIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveTaskId(id);
    setCreatingTask(false);
  }
  function selectTab(id) {
    setActiveTaskId(id);
  }
  function closeTab(id) {
    setOpenTaskIds((prev) => {
      const next = prev.filter((x) => x !== id);
      if (activeTaskId === id) setActiveTaskId(next.length ? next[next.length - 1] : null);
      return next;
    });
  }

  async function withReload(fn) {
    try {
      await fn();
      await load();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar. Probá de nuevo.");
    }
  }

  const handlers = {
    updateTask: (id, field, value) => withReload(() => api.updateTask(id, field, value)),
    addPoint: (taskId, title) => withReload(() => api.addPoint(taskId, title)),
    addPointEntry: (taskId, pointId, entry) => withReload(() => api.addPointEntry(pointId, entry)),
    togglePointDone: (taskId, pointId, done) => withReload(() => api.togglePointDone(pointId, done)),
    deletePoint: (taskId, pointId) => withReload(() => api.deletePoint(pointId)),
    addComment: (taskId, text) => withReload(() => api.addComment(taskId, text)),
    addBlocker: (taskId, text) => withReload(() => api.addBlocker(taskId, text)),
    toggleBlocker: (taskId, blockerId, resolved) => withReload(() => api.toggleBlocker(blockerId, resolved)),
    addNote: (taskId, text) => withReload(() => api.addNote(taskId, text)),
    createTask: (data) =>
      withReload(async () => {
        await api.createTask(data);
        setCreatingTask(false);
        setView("board");
      }),
    addSprint: (data) => withReload(() => api.addSprint(data)),
    moveStatus: (id, dir) =>
      withReload(async () => {
        const i = statuses.findIndex((s) => s.id === id);
        const j = i + dir;
        if (j < 0 || j >= statuses.length) return;
        await api.updateStatusPosition(statuses[i].id, statuses[j].position);
        await api.updateStatusPosition(statuses[j].id, statuses[i].position);
      }),
    deleteStatus: (id) => withReload(() => api.deleteStatus(id)),
    addStatus: (name) => withReload(() => api.addStatus(name)),
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const openTasks = openTaskIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-900">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto p-6 sm:p-10">
        <NavBar active={activeTaskId || creatingTask ? null : view} onSelect={handleNav} />
        {!creatingTask && <TabStrip openTasks={openTasks} activeTaskId={activeTaskId} onSelect={selectTab} onClose={closeTab} />}

        {error && <div className="bg-red-400/20 border border-red-300/40 text-red-50 text-sm rounded-2xl px-4 py-3 mb-4">{error}</div>}

        {loading ? (
          <p className="text-white/70 text-sm">Cargando…</p>
        ) : activeTask ? (
          <TaskDetailView task={activeTask} statuses={statuses} sprints={sprints} handlers={handlers} />
        ) : creatingTask ? (
          <CreateTaskView statuses={statuses} sprints={sprints} onCancel={() => setCreatingTask(false)} onCreate={handlers.createTask} />
        ) : view === "board" ? (
          <ListView
            statuses={statuses}
            sprints={sprints}
            tasks={tasks}
            sprintFilter={sprintFilter}
            setSprintFilter={setSprintFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onOpenTask={openTask}
            onNewTask={() => setCreatingTask(true)}
          />
        ) : view === "sprints" ? (
          <SprintsView
            sprints={sprints}
            statuses={statuses}
            tasks={tasks}
            onViewTasks={(id) => {
              setSprintFilter(id);
              setView("board");
            }}
            onAddSprint={handlers.addSprint}
          />
        ) : view === "summary" ? (
          <SummaryView tasks={tasks} summaryDate={summaryDate} setSummaryDate={setSummaryDate} />
        ) : (
          <StatusesView statuses={statuses} onMove={handlers.moveStatus} onDelete={handlers.deleteStatus} onAdd={handlers.addStatus} />
        )}
      </div>
    </div>
  );
}
