'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableTaskItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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