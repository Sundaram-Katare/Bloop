'use client';

import { useState } from "react";
import { Task } from "../types/task";
import AddTaskForm from "./AddTaskForm";

interface TaskCardProps {
    task: Task;
    onUpdate: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <AddTaskForm
                defaultStatus={task.status}
                initialTitle={task.title}
                initialDescription={task.description}
                submitLabel="Save"
                onCancel={() => setEditing(false)}
                onSubmit={({ title, description }) => {
                    onUpdate(task.id, {
                        title,
                        description,
                        updatedAt: new Date().toISOString(),
                    });
                    setEditing(false);
                }}
            />
        );
    }

    return (
        <>
            <div className="group rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-sm shadow-sm">
                <div className="flex justify-between gap-2">
                    <h4 className="font-medium text-slate-50">{task.title}</h4>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            onClick={() => setEditing(true)}
                            className="rounded px-1 text-[10px] text-slate-300 cursor-pointer hover:bg-slate-800"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="rounded px-1 text-[10px] text-red-300 cursor-pointer hover:bg-red-900/40"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {task.description && (
                    <p className="mt-1 text-xs text-slate-300">{task.description}</p>
                )}
            </div>
        </>
    )
}