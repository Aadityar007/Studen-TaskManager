import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterStatus, SortOption, CreateTaskDTO } from './types';
import { api } from './services/mockBackend';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import Modal from './components/Modal';
import TaskForm from './components/TaskForm';

const App: React.FC = () => {
  // Application State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // View State
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sort, setSort] = useState<SortOption>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Initial Data Fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Operations
  const handleCreateTask = async (data: CreateTaskDTO) => {
    try {
      const newTask = await api.createTask(data);
      setTasks(prev => [...prev, newTask]);
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to create task");
    }
  };

  const handleUpdateTask = async (data: CreateTaskDTO) => {
    if (!editingTask) return;
    try {
      const updated = await api.updateTask(editingTask._id, data);
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      setIsModalOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      alert("Failed to update task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    // Optimistic update
    const updated = { ...task, completed: !task.completed };
    setTasks(prev => prev.map(t => t._id === task._id ? updated : t));

    try {
      await api.updateTask(task._id, { completed: !task.completed });
    } catch (error) {
      // Revert if failed
      setTasks(prev => prev.map(t => t._id === task._id ? task : t));
      alert("Failed to update status");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t._id !== id));

    try {
      await api.deleteTask(id);
    } catch (error) {
      setTasks(previousTasks);
      alert("Failed to delete task");
    }
  };

  // UI Handlers
  const openAddModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  // Deriving View Data (Filter & Sort & Search)
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        t.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter
    if (filter === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    return result;
  }, [tasks, filter, sort, searchQuery]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header 
        onAddTask={openAddModal} 
        taskCount={tasks.filter(t => !t.completed).length} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <FilterBar 
          filter={filter} 
          setFilter={setFilter} 
          sort={sort} 
          setSort={setSort} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TaskList 
          tasks={filteredAndSortedTasks} 
          isLoading={isLoading}
          filter={filter}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEdit={openEditModal}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default App;