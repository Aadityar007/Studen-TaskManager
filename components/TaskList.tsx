import React from 'react';
import { Task, FilterStatus } from '../types';
import TaskCard from './TaskCard';
import { ClipboardList, CheckCircle2, ListTodo, Inbox } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  filter: FilterStatus;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, filter, onToggleComplete, onDelete, onEdit }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    let EmptyIcon = Inbox;
    let title = "No tasks available";
    let message = "Your task list is empty. Add a new task to get started!";

    if (filter === 'pending') {
      EmptyIcon = CheckCircle2;
      title = "No pending tasks";
      message = "Great job! You've cleared all your pending tasks.";
    } else if (filter === 'completed') {
      EmptyIcon = ListTodo;
      title = "No completed tasks";
      message = "Finish some tasks to see them listed here.";
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center animate-fade-in">
        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-full mb-5 transition-transform hover:scale-110 duration-300">
          <EmptyIcon className="h-10 w-10 text-violet-500 dark:text-violet-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-12 animate-slide-up">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;