import React, { useEffect, useState, useRef } from 'react';
import { Task } from '../types';

interface Props {
  task: Task | null;
  onCancel: () => void;
  triggerFade?: () => void;
}

export const PomodoroTimer: React.FC<Props> = ({ task, onCancel,triggerFade }) => {
  const [focusDuration, setFocusDuration] = useState(25); // in minutes
  const [breakDuration, setBreakDuration] = useState(5);  // in minutes
  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
const [hasStarted, setHasStarted] = useState(false); // track if user has started

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer only if not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(phase === 'work' ? focusDuration * 60 : breakDuration * 60);
    }
  }, [focusDuration, breakDuration, phase, isRunning]);

useEffect(() => {
  if (!hasStarted) {
    setTimeLeft(phase === 'work' ? focusDuration * 60 : breakDuration * 60);
  }
}, [focusDuration, breakDuration, phase, hasStarted]);
  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            const nextPhase = phase === 'work' ? 'break' : 'work';
            setPhase(nextPhase);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const stopPomodoro = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    setIsRunning(false);
    setPhase('work');
    setTimeLeft(focusDuration * 60);

    triggerFade ? triggerFade() : onCancel(); // call fade if available
  };


  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60)
      .toString()
      .padStart(2, '0')}`;

  return (
    <div className="bg-white border shadow p-4 rounded w-full max-w-md mt-6">
      <h2 className="font-bold text-lg mb-2 text-black">
        Pomodoro {task ? `— ${task.text}` : ''}
      </h2>

      <div className="mb-2 text-center text-4xl font-mono text-black">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-2 my-3">
        <button
          onClick={() => {
                setIsRunning((r) => !r);
                if (!hasStarted) setHasStarted(true);
                }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={stopPomodoro}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </button>
      </div>

      <div className="mt-4 text-sm text-left">
        <label className="block mb-1 font-medium">Focus (min)</label>
        <input
          type="number"
          min={1}
          disabled={isRunning}
          value={focusDuration}
          onChange={(e) => setFocusDuration(+e.target.value)}
          className="w-full p-1 border rounded mb-2"
        />

        <label className="block mb-1 font-medium">Break (min)</label>
        <input
          type="number"
          min={1}
          disabled={isRunning}
          value={breakDuration}
          onChange={(e) => setBreakDuration(+e.target.value)}
          className="w-full p-1 border rounded"
        />
      </div>
    </div>
  );
};
