'use client';

import { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskItem from './SortableTaskItem';

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: (data: { title: string; description: string; status: TaskStatus }) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function Column({
  status,
  title,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ColumnProps) {
  const [showForm, setShowForm] = useState(false);

  const { setNodeRef } = useDroppable({
    id: status,
    data: { columnStatus: status },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex h-full min-h-[200px] flex-col rounded-2xl bg-gradient-to-br from-green-600/70 to-green-900/90 p-4 shadow-lg transition-all duration-300 hover:shadow-2xl"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-xl font-bold text-slate-100 tracking-tight">
            {title}
          </h3>
          <span className="rounded-full bg-black px-3 py-0.5 text-xs font-medium text-slate-200 shadow-inner">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="rounded-md bg-black cursor-pointer px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-slate-600 transition-colors"
        >
          {showForm ? 'Close' : 'Add'}
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="mb-3 animate-fade-in">
          <AddTaskForm
            defaultStatus={status}
            onSubmit={data => {
              onAddTask(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && !showForm && (
        <p className="mt-6 text-center text-sm text-slate-400 italic">
          No tasks here yet. Add one to get started!
        </p>
      )}

      {/* Task List */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="mt-2 flex flex-1 flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {tasks.map(task => (
            <SortableTaskItem key={task.id} id={task.id}>
              <TaskCard
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            </SortableTaskItem>
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
