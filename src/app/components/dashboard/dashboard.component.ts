import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { DashboardStats } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="fa fa-dashboard me-2"></i>Dashboard
          </h2>
          <p class="text-muted mb-0">
            Bienvenue, {{ currentUser?.nom }} ! Voici vos statistiques
          </p>
        </div>
        <div class="col-auto">
          <div class="d-flex gap-2">
            <button class="btn btn-primary" routerLink="/tasks/new">
              <i class="fa fa-plus me-1"></i> Nouvelle tâche
            </button>
            <button class="btn btn-outline-secondary" routerLink="/calendar">
              <i class="fa fa-calendar me-1"></i> Voir calendrier
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="row mb-4" *ngIf="stats">
        <div class="col-md-3 mb-3">
          <div class="card bg-primary text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-1">Tâches totales</h6>
                  <h2 class="mb-0">{{ stats.totalTasks }}</h2>
                </div>
                <i class="fa fa-tasks fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-1">Aujourd'hui</h6>
                  <h2 class="mb-0">{{ stats.todayTasks }}</h2>
                </div>
                <i class="fa fa-calendar-check fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card bg-danger text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-1">En retard</h6>
                  <h2 class="mb-0">{{ stats.lateTasks }}</h2>
                </div>
                <i class="fa fa-exclamation-triangle fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card bg-info text-white h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-1">À venir (7j)</h6>
                  <h2 class="mb-0">{{ stats.upcomingTasks }}</h2>
                </div>
                <i class="fa fa-calendar-plus fa-2x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Autres statistiques -->
      <div class="row mb-5" *ngIf="stats">
        <div class="col-md-4 mb-3">
          <div class="card border-success h-100">
            <div class="card-body">
              <h5 class="card-title text-success">
                <i class="fa fa-check-circle me-2"></i>Terminées
              </h5>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1 me-3">
                  <div class="progress-bar bg-success"
                       [style.width]="getPercentage(stats.completedTasks, stats.totalTasks) + '%'">
                  </div>
                </div>
                <h3 class="mb-0">{{ stats.completedTasks }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card border-warning h-100">
            <div class="card-body">
              <h5 class="card-title text-warning">
                <i class="fa fa-spinner me-2"></i>En cours
              </h5>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1 me-3">
                  <div class="progress-bar bg-warning"
                       [style.width]="getPercentage(stats.inProgressTasks, stats.totalTasks) + '%'">
                  </div>
                </div>
                <h3 class="mb-0">{{ stats.inProgressTasks }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card border-primary h-100">
            <div class="card-body">
              <h5 class="card-title text-primary">
                <i class="fa fa-list-alt me-2"></i>À faire
              </h5>
              <div class="d-flex align-items-center">
                <div class="progress flex-grow-1 me-3">
                  <div class="progress-bar bg-primary"
                       [style.width]="getPercentage(stats.todoTasks, stats.totalTasks) + '%'">
                  </div>
                </div>
                <h3 class="mb-0">{{ stats.todoTasks }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="card">
        <div class="card-header bg-light">
          <h5 class="mb-0">
            <i class="fa fa-bolt me-2"></i>Actions rapides
          </h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-3">
              <button class="btn btn-outline-primary w-100 h-100 py-3" routerLink="/tasks">
                <i class="fa fa-list fa-2x mb-2 d-block"></i>
                <div>Voir toutes les tâches</div>
              </button>
            </div>
            <div class="col-md-3 mb-3">
              <button class="btn btn-outline-success w-100 h-100 py-3" routerLink="/tasks/new">
                <i class="fa fa-plus-circle fa-2x mb-2 d-block"></i>
                <div>Ajouter une tâche</div>
              </button>
            </div>
            <div class="col-md-3 mb-3">
              <button class="btn btn-outline-info w-100 h-100 py-3" routerLink="/calendar">
                <i class="fa fa-calendar-alt fa-2x mb-2 d-block"></i>
                <div>Voir calendrier</div>
              </button>
            </div>
            <div class="col-md-3 mb-3">
              <button class="btn btn-outline-warning w-100 h-100 py-3" routerLink="/tasks">
                <i class="fa fa-clock fa-2x mb-2 d-block"></i>
                <div>Tâches du jour</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .progress {
      height: 10px;
    }

    .btn-outline-primary, .btn-outline-success, .btn-outline-info, .btn-outline-warning {
      border-width: 2px;
      transition: all 0.3s;
    }

    .btn-outline-primary:hover, .btn-outline-success:hover,
    .btn-outline-info:hover, .btn-outline-warning:hover {
      transform: scale(1.05);
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  currentUser: any = null;
  loading = false;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.taskService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stats:', error);
        this.loading = false;
      }
    });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
}
