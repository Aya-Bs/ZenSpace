import { useEffect, useState } from "react";
import { PomodoroTimer } from './components/PomodoroTimer';


import "./App.css";
import { TaskInput } from "./components/TaskInput";
import { TaskList } from "./components/TaskList";
import { Task } from "./types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from './api';
import { FadeOutWrapper } from "./components/FadeOutWrapper";


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedList, setSelectedList] = useState('General');
  const lists = ['General', 'Work', 'Personal'];
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePomodoroTask, setActivePomodoroTask] = useState<Task | null>(null);




  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const tasksInSelectedList = tasks
    .filter(t => t.list === selectedList)
    .sort((a, b) => a.position - b.position);


    
 const addOrEditTask = async (text: string) => {
  const trimmedText = text.trim().toLowerCase();
  if (!trimmedText) return;

  const duplicate = tasksInSelectedList.some(
    (t) => t.text.trim().toLowerCase() === trimmedText && (!editingTask || t._id !== editingTask._id)
  );

  if (duplicate) {
    alert("Task already exists in this list.");
    return;
  }

  if (editingTask) {
    const updated = { ...editingTask, text: text.trim() };
    const saved = await updateTask(updated);
    setTasks(prev => prev.map(t => t._id === saved._id ? saved : t));
    setEditingTask(null);
  } else {
    const maxPosition = tasksInSelectedList.length > 0
      ? Math.max(...tasksInSelectedList.map(t => t.position))
      : 0;

    const newTask: Omit<Task, '_id'> = {
      text: text.trim(),
      done: false,
      list: selectedList,
      position: maxPosition + 1,
    };

    const saved = await createTask(newTask);
    setTasks(prev => [...prev, saved]);
  }

  setInput('');
};



  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    const updated = { ...task, done: !task.done };
    const saved = await updateTask(updated);
    setTasks(prev => prev.map(t => t._id === id ? saved : t));
  };

  const handleDelete = async (id: string) => {
  if (activePomodoroTask?._id === id) {
    setActivePomodoroTask(null); // stop Pomodoro
  }
  await deleteTask(id);
  setTasks(prev => prev.filter(t => t._id !== id));
  if (editingTask?._id === id) setEditingTask(null);
};

  
  const handleEditConfirm = async (task: Task, newText: string) => {
  const updated = { ...task, text: newText };
  const saved = await updateTask(updated);
  setTasks(prev => prev.map(t => t._id === saved._id ? saved : t));
  setEditingId(null); // end editing
};


  const reorderTasks = (reordered: Task[]) => {
    setTasks(prev => {
      const updatedIds = reordered.map(t => t._id);
      const reorderedTasks = reordered.map((rt, index) => {
        const original = prev.find(t => t._id === rt._id);
        const updated = original ? { ...original, position: index } : { ...rt, position: index };
        // Fire & forget API update
        updateTask(updated);
        return updated;
      });
      const untouched = prev.filter(t => !updatedIds.includes(t._id));
      return [...reorderedTasks, ...untouched];
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">📝 Personal To-Do</h1>

      <div className="flex gap-4 mb-4">
        {lists.map((listName) => (
          <button
            key={listName}
            onClick={() => setSelectedList(listName)}
            className={`px-4 py-1 rounded border ${
              selectedList === listName
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            {listName}
          </button>
        ))}
      </div>

      <TaskInput
        input={input}
        setInput={setInput}
        onSubmit={addOrEditTask}
        editingTask={editingTask}
        cancelEdit={() => setEditingTask(null)}
      />


      <TaskList
        tasks={tasksInSelectedList}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={(task) => setEditingId(task._id)}
        onReorder={reorderTasks}
        editingId={editingId}
        onEditConfirm={handleEditConfirm}
          onStartPomodoro={(task) => setActivePomodoroTask(task)}

/>
      {activePomodoroTask && (
  <FadeOutWrapper onDone={() => setActivePomodoroTask(null)}>
    <PomodoroTimer
      task={activePomodoroTask}
      onCancel={() => {}}
    />
  </FadeOutWrapper>
)}




    </div>
  );
};
export default App;
