import React, { useState } from 'react';

const DailyTasks = () => {
  // Initial state for the tasks
  const initialTasks = [
    { id: 1, text: 'Morning Workout: 30 minutes of cardio', completed: false },
    { id: 2, text: 'Meal Prep: Cook chicken and vegetables for the week', completed: false },
    { id: 3, text: 'Drink 8 glasses of water', completed: true },
    { id: 4, text: 'Evening walk: 20 minutes', completed: false },
    { id: 5, text: 'Plan tomorrow\'s meals', completed: false },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  // Toggles the 'completed' status of a task
  const handleToggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
      
      {/* Header with light text for contrast */}
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        Today's Plan
      </h2>
      
      {/* Task List container with a slightly lighter background */}
      <ul className="list-none p-4 space-y-2 bg-slate-800/50 rounded-lg">
        {tasks.map(task => (
          // List item with a darker hover effect
          <li 
            key={task.id} 
            className="flex items-center p-3 rounded-md transition-colors duration-200 hover:bg-slate-700/50"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
              className="h-5 w-5 mr-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            {/* Conditional styling for the task text with lighter colors */}
            <span className={`text-base flex-grow ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyTasks;


