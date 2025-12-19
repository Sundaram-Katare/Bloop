'use client';

import { useState, CSSProperties } from "react";
import { Task } from "../types/task";
import AddTaskForm from "./AddTaskForm";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
            <motion.div 
                ref={dragRef} 
                style={dragItemStyle}
                {...(dragHandleProps || {})} 
                className="group rounded-lg border border-slate-700 bg-slate-900/70 p-3 text-sm shadow-sm hover:bg-slate-900/90 transition-all cursor-grab active:cursor-grabbing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.2
                }}
                whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    transition: { duration: 0.2 }
                }}
                whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                }}
            >
                <div className="flex justify-between gap-2">
                    <h4 className="font-medium text-slate-50 select-none">{task.title}</h4>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                setEditing(true); 
                            }}
                            className="rounded px-1 text-[10px] text-slate-300 cursor-pointer hover:bg-slate-800 z-10"
                        >
                            Edit
                        </button>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { 
                                e.preventDefault();
                                e.stopPropagation(); 
                                onDelete(task.id); 
                                toast.success("Task deleted successfully"); 
                            }}
                            className="rounded px-1 text-[10px] text-red-300 cursor-pointer hover:bg-red-900/40 z-10"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {task.description && (
                    <p className="mt-1 text-xs text-slate-300 select-none">{task.description}</p>
                )}
            </motion.div>
        </>
    )
}