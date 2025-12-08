'use client';

import { useState, FormEvent } from 'react';
import { TaskStatus } from '../types/task';

interface AddTaskFormProps {
  defaultStatus: TaskStatus;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => Promise<void> | void;
  onCancel?: () => void;
  initialTitle?: string;
  initialDescription?: string;
  submitLabel?: string;
}

export default function AddTaskForm({
  defaultStatus,
  onSubmit,
  onCancel,
  initialTitle = '',
  initialDescription = '',
  submitLabel = 'Add Task',
}: AddTaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [status] = useState<TaskStatus>(defaultStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status });
      if (!initialTitle && !initialDescription) {
        setTitle('');
        setDescription('');
      }
    } catch {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-slate-950/70 p-3">
      <input
        className="w-full rounded border border-slate-700 bg-black px-2 py-1 text-sm outline-none focus:border-green-500"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded border border-slate-700 bg-black px-2 py-1 text-sm outline-none focus:border-green-500"
        placeholder="Description (optional)"
        rows={3}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-white px-3 py-1 text-black text-xs font-semibold hover:bg-gray-400 cursor-pointer disabled:opacity-60"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
