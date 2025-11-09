"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// -----------------------------
// 型定義
// -----------------------------
export type Task = {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  subtasks: Task[];
  completed: boolean;
  progress?: {
    max: number;
    value: number;
  };
};

const STORAGE_KEY = "next-task-manager:tasks";

type TasksContextValue = {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => void;
  addSubtask: (parentId: string, subtask: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  handlePlus: (id: string) => void;
  handleMinus: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFromStorage = (): Task[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Task[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse tasks from localStorage:", e);
      return [];
    }
  };

  const saveToStorage = (next: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save tasks to localStorage:", e);
    }
  };

  useEffect(() => {
    const saved = loadFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(saved);
    setIsLoading(false);
  }, []);

  const addTask = (task: Task) => {
    setTasks((prev) => {
      const next = [task,...prev];
      saveToStorage(next);
      return next;
    });
  };

  const addSubtaskToList = (list: Task[], parentId: string, subtask: Task): Task[] => {
    return list.map((task) => {
      if (task.id === parentId) {
        return { ...task, subtasks: [...(task.subtasks || []), subtask] };
      }
      if (task.subtasks?.length) {
        return { ...task, subtasks: addSubtaskToList(task.subtasks, parentId, subtask) };
      }
      return task;
    });
  };

  const addSubtask = (parentId: string, subtask: Task) => {
    setTasks((prev) => {
      const next = addSubtaskToList(prev, parentId, subtask);
      saveToStorage(next);
      return next;
    });
  };

  const removeTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveToStorage(next);
      return next;
    });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveToStorage(next);
      return next;
    });
  };

  const handlePlus = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id && t.progress
          ? { ...t, progress: { ...t.progress, value: Math.min(t.progress.value + 1, t.progress.max) } }
          : t
      );
      saveToStorage(updated);
      return updated;
    });
  };

  const handleMinus = (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id && t.progress
          ? { ...t, progress: { ...t.progress, value: Math.max(t.progress.value - 1, 0) } }
          : t
      );
      saveToStorage(updated);
      return updated;
    });
  };

  const value: TasksContextValue = {
    tasks,
    isLoading,
    addTask,
    addSubtask,
    removeTask,
    toggleTask,
    handlePlus,
    handleMinus,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useLocalTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useLocalTasks must be used within TasksProvider");
  return ctx;
}
