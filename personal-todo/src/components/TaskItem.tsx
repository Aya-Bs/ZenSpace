import React, { useEffect, useRef, useState } from "react";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onEditConfirm: (text: string) => void;
  isEditing: boolean;
  onStartPomodoro: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onEditConfirm,
  isEditing,
  onStartPomodoro

}) => {
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(task.done);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditText(task.text);
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const formatText = (text?: string) => {
    if (!text?.trim()) return "Untitled";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleToggle = () => {
    setChecked(true); // visually mark as done
    onToggle(); // persist to backend
    setTimeout(() => {
      setIsFading(true); // start fade
      setTimeout(() => {
        onDelete(); // actually remove after fade
      }, 300); // fade duration
    }, 500); // delay after check
  };

  return (
    <li
      onClick={(e) => {
        const isButton = (e.target as HTMLElement).closest("button");
        if (!isButton) handleToggle();
      }}
      className={`
        flex justify-between items-center p-2 rounded shadow-sm border cursor-pointer select-none
        transition-all duration-300 ease-in-out overflow-hidden
        ${isFading ? "opacity-0 max-h-0 py-0 mb-0" : "opacity-100 max-h-32"}
        ${checked ? "bg-green-100 text-gray-500 line-through" : "bg-white text-gray-800"}
      `}
    >
      <div className="flex-1 pr-2 overflow-hidden text-ellipsis">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditConfirm(editText.trim());
              if (e.key === "Escape") setEditText(task.text);
            }}
            onBlur={() => onEditConfirm(editText.trim())}
            className="w-full p-1 border rounded"
          />
        ) : (
          <span>{formatText(task.text)}</span>
        )}
      </div>

      <div className="flex gap-2 shrink-0">
        <button
  onClick={(e) => {
    e.stopPropagation();
    onStartPomodoro(task);
  }}
  className="text-green-600 hover:text-green-800 text-sm"
>
  ▶ Start Pomodoro
</button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:text-red-800"
        >
          x
        </button>
      </div>
    </li>
  );
};
