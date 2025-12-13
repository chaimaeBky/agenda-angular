import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, DashboardStats } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:8080/api'; // AJOUTEZ /api ici !

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/tasks/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/tasks`, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/tasks/${id}`);
  }

  getTasksByMonth(year: number, month: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks/calendar/${year}/${month}`);
  }

  getTasksByDate(date: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks/date/${date}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`);
  }
}
