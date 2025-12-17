import React, { useState } from 'react';
import { CreateTaskDTO, Priority, Task } from '../types';
import { parseTaskWithAI } from '../services/geminiService';
import { Sparkles, Wand2 } from 'lucide-react';
import Button from './Button';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskDTO) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ? initialData.dueDate.split('T')[0] : '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        dueDate: new Date(dueDate).toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAILoading(true);
    try {
      const result = await parseTaskWithAI(aiPrompt);
      if (result) {
        setTitle(result.title);
        setDescription(result.description);
        setPriority(result.priority);
        setDueDate(result.dueDate.split('T')[0]);
        setShowAiInput(false);
      }
    } finally {
      setIsAILoading(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm shadow-sm transition-colors focus:bg-white dark:focus:bg-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 hover:bg-gray-50/50 text-gray-900 dark:text-white dark:placeholder-gray-400";
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* AI Helper Section */}
      {!initialData && (
        <div className={`overflow-hidden rounded-xl border transition-all duration-300 ${showAiInput ? 'border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-900/10 shadow-inner' : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}>
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-violet-500 to-indigo-500 p-1 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">AI Magic Fill</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiInput(!showAiInput)}
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
            >
              {showAiInput ? 'Close' : 'Try it'}
            </button>
          </div>
          
          {showAiInput && (
            <div className="p-3 pt-0 animate-in slide-in-from-top-2">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., 'Finish physics lab report by Friday high priority'"
                className="w-full text-sm p-3 border border-violet-200 dark:border-violet-900/50 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                rows={2}
              />
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={handleAIGenerate}
                isLoading={isAILoading}
                disabled={!aiPrompt.trim()}
                className="w-full mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border-none"
              >
                <Wand2 className="w-3 h-3 mr-2" />
                Generate Details
              </Button>
            </div>
          )}
        </div>
      )}

      <div>
        <label className={labelClasses}>Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          placeholder="What needs to be done?"
        />
      </div>

      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClasses}
          placeholder="Add details about this task..."
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Priority</label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={inputClasses + " appearance-none"}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Due Date</label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 mt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;