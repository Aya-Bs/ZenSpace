import React from 'react';
import { Task } from '../types';

interface TaskInputProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (text: string) => void | Promise<void>;
  editingTask: Task | null;
  cancelEdit: () => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  input,
  setInput,
  onSubmit,
  editingTask,
}) => {
  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="flex-1 p-2 rounded border border-gray-300 shadow-sm"
        placeholder="What do you want to do today?"
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-400 text-white rounded shadow hover:bg-blue-500"
      >
        {editingTask ? 'Update' : 'Add'}
      </button>
    </div>
  );
};
