export enum TaskPriority {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export enum TaskStatus {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

export interface Task {
  id?: number;
  titre: string;
  description?: string;
  date: string; // Format YYYY-MM-DD
  heure?: string;
  priorite: TaskPriority;
  statut: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export interface TaskDTO {
  id?: number;
  titre: string;
  description?: string;
  date: string;
  heure?: string;
  priorite: TaskPriority;
  statut: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export interface DashboardStats {
  totalTasks: number;
  todayTasks: number;
  lateTasks: number;
  upcomingTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
}
