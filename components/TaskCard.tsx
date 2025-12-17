import React from 'react';
import { Task, Priority } from '../types';
import { Calendar, Check, Trash2, Edit2, AlertCircle, RotateCcw } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityConfig: Record<Priority, { bg: string; text: string; dot: string; border: string; darkBg: string; darkText: string; darkBorder: string }> = {
  low: { 
    bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200',
    darkBg: 'dark:bg-emerald-950/30', darkText: 'dark:text-emerald-400', darkBorder: 'dark:border-emerald-900/50'
  },
  medium: { 
    bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200',
    darkBg: 'dark:bg-amber-950/30', darkText: 'dark:text-amber-400', darkBorder: 'dark:border-amber-900/50'
  },
  high: { 
    bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', border: 'border-rose-200',
    darkBg: 'dark:bg-rose-950/30', darkText: 'dark:text-rose-400', darkBorder: 'dark:border-rose-900/50'
  },
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const isOverdue = React.useMemo(() => {
    if (task.completed) return false;
    // Check if due date is before today (ignoring time for simplicity, or using exact time if provided)
    return new Date(task.dueDate) < new Date();
  }, [task.dueDate, task.completed]);

  const pStyle = priorityConfig[task.priority];

  // Determine container classes based on state
  let containerClasses = "group relative bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 ";
  if (task.completed) {
    containerClasses += "opacity-75 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800";
  } else if (isOverdue) {
    containerClasses += "border-rose-300 dark:border-rose-800 ring-1 ring-rose-100 dark:ring-rose-900/20 shadow-sm hover:shadow-md hover:border-rose-400";
  } else {
    containerClasses += "border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 hover:-translate-y-0.5";
  }

  return (
    <div className={containerClasses}>
      
      {/* Priority Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${pStyle.dot}`}></div>

      <div className="p-5 flex gap-4 sm:gap-6">
        {/* Toggle / Status Icon */}
        <div className="pt-1">
          <button
            onClick={() => onToggleComplete(task)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-slate-900 ${
              task.completed 
                ? 'bg-violet-600 border-violet-600 dark:bg-violet-500 dark:border-violet-500 scale-100' 
                : isOverdue
                  ? 'border-rose-300 hover:border-rose-500 dark:border-rose-700 dark:hover:border-rose-500 bg-white dark:bg-slate-800'
                  : 'border-slate-300 hover:border-violet-500 dark:border-slate-600 dark:hover:border-violet-400 bg-transparent hover:bg-violet-50 dark:hover:bg-violet-900/20'
            }`}
            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <h4 className={`text-base sm:text-lg font-semibold leading-tight truncate pr-2 transition-all ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
              {task.title}
            </h4>
            
            <div className="self-start sm:self-auto flex items-center gap-2">
              {isOverdue && !task.completed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800">
                  Overdue!
                </span>
              )}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${pStyle.bg} ${pStyle.text} ${pStyle.border} border ${pStyle.darkBg} ${pStyle.darkText} ${pStyle.darkBorder}`}>
                {task.priority}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-normal">
            {task.description || <span className="italic opacity-60">No additional details provided.</span>}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${isOverdue ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              {task.completed ? (
                 <button
                 onClick={() => onToggleComplete(task)}
                 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors shadow-sm"
               >
                 <RotateCcw className="w-3.5 h-3.5" />
                 Restart
               </button>
              ) : (
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 rounded-lg transition-all"
                  title="Edit Task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => onDelete(task._id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 rounded-lg transition-all"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;