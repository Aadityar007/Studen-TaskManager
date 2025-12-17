export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO String
  completed: boolean;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export type FilterStatus = 'all' | 'pending' | 'completed';

export type SortOption = 'dueDate' | 'priority';

export interface CreateTaskDTO {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  completed?: boolean;
}