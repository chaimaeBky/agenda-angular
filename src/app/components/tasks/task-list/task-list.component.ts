import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="task-list">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="fa fa-tasks me-2"></i>Mes Tâches
          </h2>
          <p class="text-muted mb-0">Gérez toutes vos tâches</p>
        </div>
        <div class="col-auto">
          <div class="d-flex gap-2">
            <button class="btn btn-primary" routerLink="/tasks/new">
              <i class="fa fa-plus me-1"></i> Nouvelle tâche
            </button>
            <button class="btn btn-outline-secondary" (click)="loadTasks()">
              <i class="fa fa-refresh me-1"></i> Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Statut</label>
              <select class="form-select" [(ngModel)]="filterStatus" (change)="applyFilters()">
                <option value="">Tous les statuts</option>
                <option *ngFor="let status of statusOptions" [value]="status">
                  {{ getStatusLabel(status) }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Priorité</label>
              <select class="form-select" [(ngModel)]="filterPriority" (change)="applyFilters()">
                <option value="">Toutes les priorités</option>
                <option *ngFor="let priority of priorityOptions" [value]="priority">
                  {{ getPriorityLabel(priority) }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Tri par</label>
              <select class="form-select" [(ngModel)]="sortField" (change)="applyFilters()">
                <option value="date">Date</option>
                <option value="createdAt">Date de création</option>
                <option value="priorite">Priorité</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Ordre</label>
              <select class="form-select" [(ngModel)]="sortOrder" (change)="applyFilters()">
                <option value="desc">Décroissant</option>
                <option value="asc">Croissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des tâches -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Chargement des tâches...</p>
      </div>

      <div *ngIf="!loading && filteredTasks.length === 0" class="text-center py-5">
        <i class="fa fa-tasks fa-4x text-muted mb-3"></i>
        <h4>Aucune tâche trouvée</h4>
        <p class="text-muted mb-4">Commencez par créer votre première tâche</p>
        <button class="btn btn-primary" routerLink="/tasks/new">
          <i class="fa fa-plus me-1"></i> Créer une tâche
        </button>
      </div>

      <div class="row" *ngIf="!loading && filteredTasks.length > 0">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let task of filteredTasks"
                  [class.table-success]="task.statut === 'TERMINEE'"
                  [class.table-warning]="task.statut === 'EN_COURS'">
                <td>
                  <strong>{{ task.titre }}</strong>
                </td>
                <td>
                  <small class="text-muted">{{ task.description || 'Aucune description' }}</small>
                </td>
                <td>
                  {{ task.date | date:'dd/MM/yyyy' }}
                  <span *ngIf="isLate(task.date) && task.statut !== 'TERMINEE'"
                        class="badge bg-danger ms-1">Retard</span>
                </td>
                <td>{{ task.heure || 'Non définie' }}</td>
                <td>
                    <span class="badge priority-badge" [class.priority-low]="task.priorite === 'BASSE'"
                          [class.priority-medium]="task.priorite === 'MOYENNE'"
                          [class.priority-high]="task.priorite === 'HAUTE'"
                          [class.priority-urgent]="task.priorite === 'URGENTE'">
                            {{ getPriorityLabel(task.priorite) }}
                    </span>
                </td>
                <td>
                    <span class="badge status-badge" [class.status-todo]="task.statut === 'A_FAIRE'"
                          [class.status-progress]="task.statut === 'EN_COURS'"
                          [class.status-done]="task.statut === 'TERMINEE'">
                            {{ getStatusLabel(task.statut) }}
                    </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" [routerLink]="['/tasks/edit', task.id]">
                      <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-info" (click)="viewTask(task)">
                      <i class="fa fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" (click)="deleteTask(task.id!)">
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="text-muted">
              {{ filteredTasks.length }} tâche(s) trouvée(s)
            </div>
            <div *ngIf="tasks.length !== filteredTasks.length" class="text-muted">
              (Filtré parmi {{ tasks.length }} tâches)
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-hover tbody tr:hover {
      background-color: rgba(0, 123, 255, 0.05);
    }

    .badge {
      font-size: 0.8em;
      padding: 0.4em 0.8em;
    }

    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }

    .cursor-pointer {
      cursor: pointer;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;

  // Filtres
  filterStatus: string = '';
  filterPriority: string = '';
  sortField: string = 'date';
  sortOrder: string = 'desc';

  // Options
  statusOptions = Object.values(TaskStatus);
  priorityOptions = Object.values(TaskPriority);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.tasks];

    // Filtre par statut
    if (this.filterStatus) {
      filtered = filtered.filter(task => task.statut === this.filterStatus);
    }

    // Filtre par priorité
    if (this.filterPriority) {
      filtered = filtered.filter(task => task.priorite === this.filterPriority);
    }

    // Tri
    filtered.sort((a: any, b: any) => {
      let aValue = a[this.sortField];
      let bValue = b[this.sortField];

      // Gérer les dates
      if (this.sortField.includes('date') || this.sortField.includes('At')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredTasks = filtered;
  }

  viewTask(task: Task) {
    // Modal simple
    alert(`Détails de la tâche:\n\n` +
      `Titre: ${task.titre}\n` +
      `Description: ${task.description || 'Aucune'}\n` +
      `Date: ${task.date}\n` +
      `Heure: ${task.heure || 'Non définie'}\n` +
      `Priorité: ${this.getPriorityLabel(task.priorite)}\n` +
      `Statut: ${this.getStatusLabel(task.statut)}`);
  }

  deleteTask(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  isLate(dateString: string): boolean {
    const taskDate = new Date(dateString);
    const today = new Date();
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  }

  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.A_FAIRE]: 'À faire',
      [TaskStatus.EN_COURS]: 'En cours',
      [TaskStatus.TERMINEE]: 'Terminée',
      [TaskStatus.ANNULEE]: 'Annulée'
    };
    return labels[status];
  }

  getPriorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      [TaskPriority.BASSE]: 'Basse',
      [TaskPriority.MOYENNE]: 'Moyenne',
      [TaskPriority.HAUTE]: 'Haute',
      [TaskPriority.URGENTE]: 'Urgente'
    };
    return labels[priority];
  }
}
