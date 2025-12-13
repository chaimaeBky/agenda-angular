import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task, Priorite, Statut } from '../../../models/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="row mb-4">
      <div class="col">
        <h2><i class="fas fa-tasks me-2"></i>Liste des tâches</h2>
        <p class="text-muted">Gérez toutes vos tâches</p>
      </div>
      <div class="col-auto">
        <a routerLink="/tasks/new" class="btn btn-primary">
          <i class="fas fa-plus-circle me-2"></i>Nouvelle tâche
        </a>
      </div>
    </div>

    <!-- Filtres -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Statut</label>
            <select class="form-select" [(ngModel)]="filterStatut" (ngModelChange)="applyFilters()">
              <option value="">Tous les statuts</option>
              <option *ngFor="let statut of statutValues" [value]="statut">
                {{ getStatutLabel(statut) }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Priorité</label>
            <select class="form-select" [(ngModel)]="filterPriorite" (ngModelChange)="applyFilters()">
              <option value="">Toutes les priorités</option>
              <option *ngFor="let priorite of prioriteValues" [value]="priorite">
                {{ getPrioriteLabel(priorite) }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Date</label>
            <input type="date" class="form-control" [(ngModel)]="filterDate" (ngModelChange)="applyFilters()">
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" (click)="resetFilters()">
              <i class="fas fa-times-circle me-2"></i>Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des tâches -->
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
        <tr *ngFor="let task of filteredTasks" [class.table-warning]="isLate(task)">
          <td>
            <strong>{{ task.titre }}</strong>
          </td>
          <td>
            <small class="text-muted">{{ task.description || 'Aucune description' }}</small>
          </td>
          <td>
            {{ task.date | date:'dd/MM/yyyy' }}
            <span *ngIf="isLate(task)" class="badge bg-danger ms-2">En retard</span>
            <span *ngIf="isToday(task)" class="badge bg-warning ms-2">Aujourd'hui</span>
          </td>
          <td>
            <span *ngIf="task.heure">{{ task.heure }}</span>
            <span *ngIf="!task.heure" class="text-muted">Toute la journée</span>
          </td>
          <td>
              <span class="badge" [ngClass]="getPriorityClass(task.priorite)">
                {{ getPrioriteLabel(task.priorite) }}
              </span>
          </td>
          <td>
              <span class="badge" [ngClass]="getStatusClass(task.statut)">
                {{ getStatutLabel(task.statut) }}
              </span>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" [routerLink]="['/tasks/edit', task.id]">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-outline-danger" (click)="deleteTask(task.id!)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        <tr *ngIf="filteredTasks.length === 0">
          <td colspan="7" class="text-center text-muted py-4">
            <i class="fas fa-inbox fa-3x d-block mb-2"></i>
            Aucune tâche trouvée
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .badge {
      font-size: 0.8em;
    }
  `]
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  filterStatut: string = '';
  filterPriorite: string = '';
  filterDate: string = '';

  prioriteValues = Object.values(Priorite);
  statutValues = Object.values(Statut);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = [...this.tasks];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
      }
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      let matches = true;

      if (this.filterStatut && task.statut !== this.filterStatut) {
        matches = false;
      }

      if (this.filterPriorite && task.priorite !== this.filterPriorite) {
        matches = false;
      }

      if (this.filterDate) {
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        if (taskDate !== this.filterDate) {
          matches = false;
        }
      }

      return matches;
    });
  }

  resetFilters() {
    this.filterStatut = '';
    this.filterPriorite = '';
    this.filterDate = '';
    this.filteredTasks = [...this.tasks];
  }

  deleteTask(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la tâche');
        }
      });
    }
  }

  getPriorityClass(priorite: Priorite): string {
    switch (priorite) {
      case Priorite.URGENTE: return 'bg-danger';
      case Priorite.HAUTE: return 'bg-warning text-dark';
      case Priorite.MOYENNE: return 'bg-info';
      case Priorite.BASSE: return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getStatusClass(statut: Statut): string {
    switch (statut) {
      case Statut.A_FAIRE: return 'bg-secondary';
      case Statut.EN_COURS: return 'bg-primary';
      case Statut.TERMINEE: return 'bg-success';
      case Statut.ANNULEE: return 'bg-danger';
      default: return 'bg-light text-dark';
    }
  }

  getPrioriteLabel(priorite: Priorite): string {
    switch (priorite) {
      case Priorite.BASSE: return 'Basse';
      case Priorite.MOYENNE: return 'Moyenne';
      case Priorite.HAUTE: return 'Haute';
      case Priorite.URGENTE: return 'Urgente';
      default: return priorite;
    }
  }

  getStatutLabel(statut: Statut): string {
    switch (statut) {
      case Statut.A_FAIRE: return 'À faire';
      case Statut.EN_COURS: return 'En cours';
      case Statut.TERMINEE: return 'Terminée';
      case Statut.ANNULEE: return 'Annulée';
      default: return statut;
    }
  }

  isLate(task: Task): boolean {
    const taskDate = new Date(task.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today && task.statut !== Statut.TERMINEE && task.statut !== Statut.ANNULEE;
  }

  isToday(task: Task): boolean {
    const taskDate = new Date(task.date).toDateString();
    const today = new Date().toDateString();
    return taskDate === today;
  }
}
