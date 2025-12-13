import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskDTO, DashboardStats } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Tâches
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { withCredentials: true });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`, { withCredentials: true });
  }

  createTask(task: TaskDTO): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task, { withCredentials: true });
  }

  updateTask(id: number, task: TaskDTO): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task, { withCredentials: true });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`, { withCredentials: true });
  }

  getTasksByDate(date: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/date/${date}`, { withCredentials: true });
  }

  getTasksByMonth(year: number, month: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/calendar/${year}/${month}`, { withCredentials: true });
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { withCredentials: true });
  }
}
