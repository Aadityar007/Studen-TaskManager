import React from 'react';
import { CheckSquare, Layout, Moon, Sun } from 'lucide-react';
import Button from './Button';

interface HeaderProps {
  onAddTask: () => void;
  taskCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask, taskCount, theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">TaskMaster</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{taskCount} tasks active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <Button onClick={onAddTask} size="sm" className="hidden sm:inline-flex shadow-indigo-500/20">
            <span className="mr-1 text-lg leading-none">+</span> New Task
          </Button>
          <Button onClick={onAddTask} size="sm" className="sm:hidden aspect-square p-0 w-8 h-8 flex items-center justify-center rounded-full">
            +
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;