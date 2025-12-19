'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types/task';
import { loadTasks, saveTasks } from '../lib/storage';
import Column from './Column';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';

const initialColumns: { status: TaskStatus; title: string }[] = [
  { status: 'todo',        title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done',        title: 'Done' },
];

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 100,
        tolerance: 5,
      },
    })
  );

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) return;
    
    const activeTask = tasks.find(t => t.id === activeId);
    const overTask = over.data.current?.task;
    
    if (!activeTask) return;
    
    // If dragging over another task
    if (overTask && activeTask.status === overTask.status) {
      setTasks(prev => {
        const oldIndex = prev.findIndex(t => t.id === activeId);
        const newIndex = prev.findIndex(t => t.id === overId);
        
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped over a column directly
    let targetStatus = over.data.current?.columnStatus as TaskStatus | undefined;
    
    // If not dropped over a column, check if dropped over a task
    if (!targetStatus && over.data.current?.task) {
      targetStatus = over.data.current.task.status as TaskStatus;
    }
    
    if (!targetStatus) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // If moving to a different column
    if (activeTask.status !== targetStatus) {
      setTasks(prev =>
        prev.map(task =>
          task.id === activeId ? { ...task, status: targetStatus, updatedAt: new Date().toISOString() } : task,
        ),
      );
    }
  }, [tasks]);

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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 md:grid-cols-3 md:mt-16 items-start">
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
          
          <DragOverlay dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          }}>
            {activeTask ? (
              <motion.div
                initial={{ scale: 1, rotate: 0, opacity: 0.8 }}
                animate={{ 
                  scale: 1.08, 
                  rotate: 4,
                  opacity: 1,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="cursor-grabbing"
                style={{
                  transformOrigin: 'center',
                }}
              >
                <div className="opacity-90">
                  <TaskCard
                    task={activeTask}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
