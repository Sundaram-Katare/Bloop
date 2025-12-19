'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

export default function SortableTaskItem({
  id,
  children,
  task,
}: {
  id: string;
  children: React.ReactNode;
  task?: any;
}) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ 
    id,
    data: {
      task,
    },
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 9999 : 'auto',
    position: 'relative' as const,
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      dragHandleProps: { ...attributes, ...listeners },
      dragRef: setNodeRef,
      dragItemStyle: style,
      isDragging,
    } as Record<string, unknown>);
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}