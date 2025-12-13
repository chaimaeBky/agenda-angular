import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { DashboardStats } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row mb-4">
      <div class="col">
        <h2><i class="bi bi-speedometer2 me-2"></i>Dashboard</h2>
        <p class="text-muted">Vue d'ensemble de vos tâches</p>
      </div>
      <div class="col-auto">
        <a routerLink="/tasks/new" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Nouvelle tâche
        </a>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">Tâches du jour</h6>
                <h2 class="mb-0">{{ stats.todayTasks }}</h2>
              </div>
              <i class="bi bi-calendar-day display-6"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">En retard</h6>
                <h2 class="mb-0">{{ stats.lateTasks }}</h2>
              </div>
              <i class="bi bi-exclamation-triangle display-6"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">À venir</h6>
                <h2 class="mb-0">{{ stats.upcomingTasks }}</h2>
              </div>
              <i class="bi bi-calendar3 display-6"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title">Terminées</h6>
                <h2 class="mb-0">{{ stats.completedTasks }}</h2>
              </div>
              <i class="bi bi-check-circle display-6"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statut des tâches -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-header bg-info text-white">
            <h6 class="mb-0"><i class="bi bi-list-ul me-2"></i>À faire</h6>
          </div>
          <div class="card-body text-center">
            <h1 class="display-4">{{ stats.todoTasks }}</h1>
            <p class="text-muted">Tâches en attente</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-header bg-warning text-dark">
            <h6 class="mb-0"><i class="bi bi-hourglass-split me-2"></i>En cours</h6>
          </div>
          <div class="card-body text-center">
            <h1 class="display-4">{{ stats.inProgressTasks }}</h1>
            <p class="text-muted">Tâches en cours</p>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h6 class="mb-0"><i class="bi bi-check-all me-2"></i>Total</h6>
          </div>
          <div class="card-body text-center">
            <h1 class="display-4">{{ stats.totalTasks }}</h1>
            <p class="text-muted">Tâches au total</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0"><i class="bi bi-lightning-charge me-2"></i>Actions rapides</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-3">
                <a routerLink="/tasks" class="btn btn-outline-primary w-100">
                  <i class="bi bi-list-task me-2"></i>Voir toutes les tâches
                </a>
              </div>
              <div class="col-md-3 mb-3">
                <a routerLink="/calendar" class="btn btn-outline-success w-100">
                  <i class="bi bi-calendar3 me-2"></i>Voir le calendrier
                </a>
              </div>
              <div class="col-md-3 mb-3">
                <a routerLink="/tasks/new" class="btn btn-outline-warning w-100">
                  <i class="bi bi-plus-circle me-2"></i>Ajouter une tâche
                </a>
              </div>
              <div class="col-md-3 mb-3">
                <button class="btn btn-outline-info w-100" (click)="loadStats()">
                  <i class="bi bi-arrow-clockwise me-2"></i>Rafraîchir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalTasks: 0,
    todayTasks: 0,
    lateTasks: 0,
    upcomingTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadStats();
  }

  // In dashboard.component.ts, update the error handling:
  loadStats() {
    this.taskService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        // If 403, you're not logged in (session expired)
        if (error.status === 403) {
          // Redirect to login or show message
          console.log('Session expired or not logged in');
          // Optional: window.location.href = '/login';
        }
      }
    });
  }
}
