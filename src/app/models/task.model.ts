export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export enum Statut {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

export interface Task {
  id?: number;
  titre: string;
  description: string;
  date: string; // format: 'yyyy-MM-dd'
  heure?: string;
  priorite: Priorite;
  statut: Statut;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
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
