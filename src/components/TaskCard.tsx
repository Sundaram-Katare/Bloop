'use client';

import { useState, CSSProperties } from "react";
import { Task } from "../types/task";
import AddTaskForm from "./AddTaskForm";
import { toast } from "sonner";

interface TaskCardProps {
    task: Task;
    onUpdate: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string) => void;
    dragHandleProps?: Record<string, any>;
    dragRef?: (node: HTMLElement | null) => void;
    dragItemStyle?: CSSProperties;
    isDragging?: boolean;
}

export default function TaskCard({ task, onUpdate, onDelete, dragHandleProps, dragRef, dragItemStyle }: TaskCardProps) {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <div ref={dragRef} style={dragItemStyle}>
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
            </div>
        );
    }

    return (
        <>
            <div ref={dragRef} style={dragItemStyle} className="group rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-sm shadow-sm hover:bg-slate-900/90 transition-colors">
                <div className="flex justify-between gap-2">
                    <h4 className="font-medium text-slate-50">{task.title}</h4>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            {...(dragHandleProps || {})}
                            className="rounded px-1 text-[10px] text-slate-300 cursor-grab hover:bg-slate-800"
                        >
                            ⠿
                        </button>
                        <button
                            onClick={() => setEditing(true)}
                            className="rounded px-1 text-[10px] text-slate-300 cursor-pointer hover:bg-slate-800"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {onDelete(task.id); toast.success("Task deleted successfully"); }}
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