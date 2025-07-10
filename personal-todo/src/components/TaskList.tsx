import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onEditConfirm: (task: Task, newText: string) => void;
  onReorder: (tasks: Task[]) => void;
  editingId: string | null;
  onStartPomodoro: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onEditConfirm,
  onReorder,
  editingId,
  onStartPomodoro
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t._id === active.id);
    const newIndex = tasks.findIndex(t => t._id === over.id);
    const newTasks = arrayMove(tasks, oldIndex, newIndex).map((task, index) => ({
      ...task,
      position: index
    }));

    onReorder(newTasks);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <ul className="mt-6 space-y-2 w-full max-w-md">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task._id}
              task={task}
              onToggle={() => onToggle(task._id)}
              onDelete={() => onDelete(task._id)}
              onEdit={() => onEdit(task)}
              onEditConfirm={(newText) => onEditConfirm(task, newText)}
              isEditing={editingId === task._id}
              onStartPomodoro={() => onStartPomodoro(task)} // ✅ fix here
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

const SortableTaskItem: React.FC<{
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onEditConfirm: (newText: string) => void;
  isEditing: boolean;
  onStartPomodoro: () => void; // ✅ function, not task
}> = ({ task, onToggle, onDelete, onEdit, onEditConfirm, isEditing, onStartPomodoro }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onPointerDown={(e) => {
        const isButton = (e.target as HTMLElement).closest('button, input');
        if (isButton) {
          e.stopPropagation();
        }
      }}
    >
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onEditConfirm={onEditConfirm}
        isEditing={isEditing}
        onStartPomodoro={onStartPomodoro}
      />
    </div>
  );
};
