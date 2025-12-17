import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types';

const STORAGE_KEY = 'student_tasks_db';
const DELAY_MS = 600; // Simulate network latency

// Helper to generate a fake ObjectId-like string
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper to load from storage
const loadTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save to storage
const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const api = {
  getTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadTasks());
      }, DELAY_MS);
    });
  },

  createTask: async (dto: CreateTaskDTO): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = loadTasks();
        const newTask: Task = {
          _id: generateId(),
          ...dto,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveTasks([...tasks, newTask]);
        resolve(newTask);
      }, DELAY_MS);
    });
  },

  updateTask: async (id: string, dto: UpdateTaskDTO): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = loadTasks();
        const index = tasks.findIndex((t) => t._id === id);
        if (index === -1) {
          reject(new Error('Task not found'));
          return;
        }

        const updatedTask = {
          ...tasks[index],
          ...dto,
          updatedAt: new Date().toISOString(),
        };

        tasks[index] = updatedTask;
        saveTasks(tasks);
        resolve(updatedTask);
      }, DELAY_MS);
    });
  },

  deleteTask: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = loadTasks();
        const filtered = tasks.filter((t) => t._id !== id);
        saveTasks(filtered);
        resolve();
      }, DELAY_MS);
    });
  },
};