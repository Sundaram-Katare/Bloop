'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Task, TaskStatus } from '../types/task';
import { loadTasks, saveTasks } from '../lib/storage';
import Column from './Column';

const initialColumns: { status: TaskStatus; title: string }[] = [
  { status: 'todo',        title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done',        title: 'Done' },
];

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = loadTasks();
    setTasks(t);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  function addTask(data: { title: string; description: string; status: TaskStatus }) {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
  }

  function updateTask(id: string, updates: Partial<Task>) {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task)),
    );
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const columnStatus = over.data.current?.columnStatus as TaskStatus | undefined;
    if (!columnStatus) return;

    setTasks(prev =>
      prev.map(task =>
        task.id === activeId ? { ...task, status: columnStatus } : task,
      ),
    );
  }

  return (
    <div className="space-y-4 font-poppins ">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className='flex flex-col justify-center items-start'>
          <h1 className="text-xl md:text-4xl text-center mb-2 font-semibold text-slate-50">
            Bloop - Task Management Board
          </h1>
          <p className="text-sm text-center md:text-lg text-slate-400">
            Drag tasks between columns to track progress.
          </p>
        </div>
      </header>

      {loading ? (
        <p className="mt-10 text-center text-sm text-slate-400">
          Loading tasks...
        </p>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 md:grid-cols-3 md:mt-16">
            {initialColumns.map(col => (
              <div
                key={col.status}
                data-column={col.status}
                // used by dnd-kit via data
                data-column-status={col.status}
              >
                <Column
                  status={col.status}
                  title={col.title}
                  tasks={tasks.filter(t => t.status === col.status)}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                />
              </div>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
