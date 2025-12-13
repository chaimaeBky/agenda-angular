import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="calendar-view">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="fa fa-calendar me-2"></i>Calendrier
          </h2>
          <p class="text-muted mb-0">Visualisez vos tâches par mois</p>
        </div>
        <div class="col-auto">
          <div class="d-flex gap-2 align-items-center">
            <button class="btn btn-outline-secondary" (click)="previousMonth()">
              <i class="fa fa-chevron-left"></i>
            </button>

            <h4 class="mb-0 mx-3">
              {{ getMonthName(currentMonth) }} {{ currentYear }}
            </h4>

            <button class="btn btn-outline-secondary" (click)="nextMonth()">
              <i class="fa fa-chevron-right"></i>
            </button>

            <button class="btn btn-primary ms-3" (click)="goToToday()">
              <i class="fa fa-calendar-check me-1"></i> Aujourd'hui
            </button>
          </div>
        </div>
      </div>

      <!-- Contrôles -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-center">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fa fa-filter"></i>
                </span>
                <select class="form-select" [(ngModel)]="filterStatus" (change)="loadTasksForMonth()">
                  <option value="">Tous les statuts</option>
                  <option *ngFor="let status of statusOptions" [value]="status">
                    {{ getStatusLabel(status) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fa fa-sort-amount-asc"></i>
                </span>
                <select class="form-select" [(ngModel)]="filterPriority" (change)="loadTasksForMonth()">
                  <option value="">Toutes les priorités</option>
                  <option *ngFor="let priority of priorityOptions" [value]="priority">
                    {{ getPriorityLabel(priority) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-4 text-end">
              <button class="btn btn-success" routerLink="/tasks/new">
                <i class="fa fa-plus me-1"></i> Ajouter au calendrier
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendrier -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered mb-0">
              <thead class="table-light">
              <tr>
                <th class="text-center" style="width: 14.28%">Lun</th>
                <th class="text-center" style="width: 14.28%">Mar</th>
                <th class="text-center" style="width: 14.28%">Mer</th>
                <th class="text-center" style="width: 14.28%">Jeu</th>
                <th class="text-center" style="width: 14.28%">Ven</th>
                <th class="text-center" style="width: 14.28%">Sam</th>
                <th class="text-center" style="width: 14.28%">Dim</th>
              </tr>
              </thead>
              <tbody>
              <tr *ngFor="let week of calendarWeeks">
                <td *ngFor="let day of week"
                    [class.table-secondary]="!day.isCurrentMonth"
                    [class.today]="day.isToday"
                    class="calendar-day p-2"
                    [style.height]="'150px'"
                    (click)="selectDay(day)">

                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge" [class.bg-primary]="day.isToday">
                          {{ day.date.getDate() }}
                        </span>
                      <small class="text-muted ms-1" *ngIf="!day.isCurrentMonth">
                        {{ getMonthName(day.date.getMonth()) }}
                      </small>
                    </div>
                    <small *ngIf="day.taskCount > 0" class="badge bg-info">
                      {{ day.taskCount }}
                    </small>
                  </div>

                  <div class="day-tasks">
                    <div *ngFor="let task of day.tasks"
                         class="task-item small mb-1 p-1 rounded"
                         [class.bg-success]="task.statut === 'TERMINEE'"
                         [class.bg-warning]="task.statut === 'EN_COURS'"
                         [class.bg-primary]="task.statut === 'A_FAIRE'"
                         [class.bg-danger]="task.priorite === 'URGENTE'"
                         [style.opacity]="task.statut === 'TERMINEE' ? '0.7' : '1'"
                         (click)="viewTask(task); $event.stopPropagation()">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="text-truncate text-white">
                          {{ task.titre }}
                        </div>
                        <small class="text-white ms-1">
                          <i class="fa"
                             [class.fa-check]="task.statut === 'TERMINEE'"
                             [class.fa-spinner]="task.statut === 'EN_COURS'"
                             [class.fa-clock]="task.statut === 'A_FAIRE'">
                          </i>
                        </small>
                      </div>
                      <div *ngIf="task.heure" class="text-white small">
                        {{ task.heure }}
                      </div>
                    </div>
                  </div>

                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Légende -->
      <div class="card mt-4">
        <div class="card-body">
          <h6 class="mb-3">
            <i class="fa fa-key me-2"></i>Légende
          </h6>
          <div class="row">
            <div class="col-auto mb-2">
              <span class="badge bg-primary me-1">Aujourd'hui</span>
              <small>Jour actuel</small>
            </div>
            <div class="col-auto mb-2">
              <span class="badge bg-success me-1">Terminée</span>
              <small>Tâche terminée</small>
            </div>
            <div class="col-auto mb-2">
              <span class="badge bg-warning me-1">En cours</span>
              <small>Tâche en cours</small>
            </div>
            <div class="col-auto mb-2">
              <span class="badge bg-danger me-1">Urgente</span>
              <small>Priorité urgente </small>
            </div>
            <div class="col-auto mb-2">
              <span class="badge bg-info me-1">Nombre</span>
              <small>Nombre de tâches</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Tâches du jour sélectionné -->
      <div class="card mt-4" *ngIf="selectedDay && selectedDayTasks.length > 0">
        <div class="card-header bg-light">
          <h5 class="mb-0">
            <i class="fa fa-list me-2"></i>
            Tâches du {{ selectedDay.date | date:'dd/MM/yyyy' }}
            <span class="badge bg-primary ms-2">{{ selectedDayTasks.length }}</span>
          </h5>
        </div>
        <div class="card-body">
          <div class="list-group">
            <div *ngFor="let task of selectedDayTasks" class="list-group-item">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1">{{ task.titre }}</h6>
                  <small class="text-muted">{{ task.description || 'Aucune description' }}</small>
                  <div class="mt-1">
                    <span class="badge me-1"
                          [class.bg-success]="task.priorite === 'BASSE'"
                          [class.bg-primary]="task.priorite === 'MOYENNE'"
                          [class.bg-warning]="task.priorite === 'HAUTE'"
                          [class.bg-danger]="task.priorite === 'URGENTE'">
                      {{ getPriorityLabel(task.priorite) }}
                    </span>
                    <span class="badge"
                          [class.bg-secondary]="task.statut === 'A_FAIRE'"
                          [class.bg-warning]="task.statut === 'EN_COURS'"
                          [class.bg-success]="task.statut === 'TERMINEE'">
                      {{ getStatusLabel(task.statut) }}
                    </span>
                  </div>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm" [routerLink]="['/tasks/edit', task.id]">
                    <i class="fa fa-edit"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-day {
      vertical-align: top;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .calendar-day:hover {
      background-color: rgba(0, 123, 255, 0.05) !important;
    }

    .calendar-day.today {
      background-color: rgba(0, 123, 255, 0.1) !important;
    }

    .day-tasks {
      max-height: 100px;
      overflow-y: auto;
    }

    .task-item {
      cursor: pointer;
      transition: transform 0.2s;
    }

    .task-item:hover {
      transform: translateX(2px);
    }

    .table-bordered {
      border: 1px solid #dee2e6;
    }

    .table-bordered th, .table-bordered td {
      border: 1px solid #dee2e6;
    }
  `]
})
export class CalendarViewComponent implements OnInit {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth() + 1; // 1-12

  calendarWeeks: any[] = [];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  selectedDay: any = null;
  selectedDayTasks: Task[] = [];

  filterStatus: string = '';
  filterPriority: string = '';

  statusOptions = Object.values(TaskStatus);
  priorityOptions = Object.values(TaskPriority);

  loading = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasksForMonth();
    this.generateCalendar();
  }

  loadTasksForMonth() {
    this.loading = true;
    this.taskService.getTasksByMonth(this.currentYear, this.currentMonth).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.loading = false;
        this.generateCalendar();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tâches:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredTasks = [...this.tasks];

    if (this.filterStatus) {
      this.filteredTasks = this.filteredTasks.filter(task => task.statut === this.filterStatus);
    }

    if (this.filterPriority) {
      this.filteredTasks = this.filteredTasks.filter(task => task.priorite === this.filterPriority);
    }
  }

  generateCalendar() {
    this.calendarWeeks = [];

    // Premier jour du mois
    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
    // Dernier jour du mois
    const lastDay = new Date(this.currentYear, this.currentMonth, 0);

    // Premier jour de la semaine (Lundi = 1, ajustement pour JS où Dimanche = 0)
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Dimanche devient 7
    firstDayOfWeek--; // Ajuster pour commencer à 0 (Lundi)

    // Dernier jour de la semaine
    let lastDayOfWeek = lastDay.getDay();
    if (lastDayOfWeek === 0) lastDayOfWeek = 7;
    lastDayOfWeek--;

    // Date du jour
    const today = new Date();
    const isToday = (date: Date) =>
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    // Calculer les dates
    let currentDate = new Date(firstDay);
    currentDate.setDate(currentDate.getDate() - firstDayOfWeek);

    // Générer 6 semaines (maximum)
    for (let week = 0; week < 6; week++) {
      const weekDays = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(currentDate);
        const isCurrentMonth = date.getMonth() === this.currentMonth - 1;

        // Trouver les tâches pour ce jour
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = this.filteredTasks.filter(task => task.date === dateStr);

        weekDays.push({
          date: date,
          isCurrentMonth: isCurrentMonth,
          isToday: isToday(date),
          taskCount: dayTasks.length,
          tasks: dayTasks.slice(0, 3) // Limiter à 3 tâches pour l'affichage
        });

        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.calendarWeeks.push(weekDays);

      // Si nous avons dépassé le dernier jour du mois et que nous sommes dans le mois suivant
      if (currentDate.getMonth() > this.currentMonth % 12 && currentDate > lastDay) {
        break;
      }
    }
  }

  previousMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadTasksForMonth();
  }

  nextMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadTasksForMonth();
  }

  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.loadTasksForMonth();
  }

  selectDay(day: any) {
    this.selectedDay = day;
    this.selectedDayTasks = day.tasks;
  }

  viewTask(task: Task) {
    alert(`Détails de la tâche:\n\n` +
      `Titre: ${task.titre}\n` +
      `Description: ${task.description || 'Aucune'}\n` +
      `Date: ${task.date}\n` +
      `Heure: ${task.heure || 'Non définie'}\n` +
      `Priorité: ${this.getPriorityLabel(task.priorite)}\n` +
      `Statut: ${this.getStatusLabel(task.statut)}`);
  }

  getMonthName(month: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
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
