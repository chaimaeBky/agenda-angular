import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task, Priorite, Statut } from '../../../models/task.model';
import { FormsModule } from '@angular/forms';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

interface CalendarEvent {
  id?: number;
  title: string;
  date: string;
  heure?: string;
  priorite: Priorite;
  statut: Statut;
  description?: string;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row mb-4">
      <div class="col">
        <h2><i class="fas fa-calendar-alt me-2"></i>Calendrier</h2>
        <p class="text-muted">Visualisez vos tâches par mois</p>
      </div>
      <div class="col-auto">
        <div class="btn-group">
          <button class="btn btn-outline-secondary" (click)="previousMonth()">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="btn btn-outline-secondary" disabled>
            {{ getMonthYear() }}
          </button>
          <button class="btn btn-outline-secondary" (click)="nextMonth()">
            <i class="fas fa-chevron-right"></i>
          </button>
          <button class="btn btn-outline-primary ms-2" (click)="goToToday()">
            <i class="fas fa-calendar-check me-2"></i>Aujourd'hui
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation par mois -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-2">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input type="month" class="form-control" [value]="currentYear + '-' + padMonth(currentMonth)"
                     (change)="onMonthChange($event)">
            </div>
          </div>
          <div class="col-md-8">
            <div class="d-flex justify-content-end">
              <div class="btn-group">
                <button class="btn btn-outline-primary active">
                  <i class="fas fa-calendar-alt me-2"></i>Vue mois
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendrier -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0">
            <thead>
              <tr class="table-light">
                <th class="text-center" style="width: 14.28%">Lundi</th>
                <th class="text-center" style="width: 14.28%">Mardi</th>
                <th class="text-center" style="width: 14.28%">Mercredi</th>
                <th class="text-center" style="width: 14.28%">Jeudi</th>
                <th class="text-center" style="width: 14.28%">Vendredi</th>
                <th class="text-center" style="width: 14.28%">Samedi</th>
                <th class="text-center" style="width: 14.28%">Dimanche</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let week of calendarWeeks">
                <td *ngFor="let day of week" class="calendar-day" [ngClass]="{
                  'today': isToday(day.date),
                  'other-month': !day.isCurrentMonth,
                  'has-events': day.events.length > 0
                }">
                  <div class="calendar-day-header">
                    <span class="day-number">{{ day.date.getDate() }}</span>
                    <span *ngIf="isToday(day.date)" class="badge bg-danger ms-1">Aujourd'hui</span>
                  </div>
                  <div class="calendar-events">
                    <div *ngFor="let event of day.events" class="calendar-event"
                         [style.backgroundColor]="getPriorityColor(event.priorite)">
                      <div class="event-content">
                        <strong>{{ event.title }}</strong>
                        <small *ngIf="event.heure">{{ event.heure }}</small>
                        <span class="badge" [ngClass]="getStatusClass(event.statut)">
                          {{ getStatutLabel(event.statut) }}
                        </span>
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
    <div class="row mt-4">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title"><i class="fas fa-info-circle me-2"></i>Légende</h6>
            <div class="row g-3">
              <div class="col-auto d-flex align-items-center">
                <span class="badge bg-danger me-2">Aujourd'hui</span>
                <span class="text-muted">Jour actuel</span>
              </div>
              <div class="col-auto d-flex align-items-center">
                <span class="badge" [style.background]="getPriorityColor(Priorite.URGENTE)">Urgente</span>
                <span class="text-muted ms-2">Priorité urgente</span>
              </div>
              <div class="col-auto d-flex align-items-center">
                <span class="badge" [style.background]="getPriorityColor(Priorite.HAUTE)">Haute</span>
                <span class="text-muted ms-2">Priorité haute</span>
              </div>
              <div class="col-auto d-flex align-items-center">
                <span class="badge" [style.background]="getPriorityColor(Priorite.MOYENNE)">Moyenne</span>
                <span class="text-muted ms-2">Priorité moyenne</span>
              </div>
              <div class="col-auto d-flex align-items-center">
                <span class="badge" [style.background]="getPriorityColor(Priorite.BASSE)">Basse</span>
                <span class="text-muted ms-2">Priorité basse</span>
              </div>
              <div class="col-auto d-flex align-items-center">
                <span class="badge bg-primary me-1"></span>
                <span class="badge bg-success me-1"></span>
                <span class="badge bg-secondary me-1"></span>
                <span class="badge bg-danger me-1"></span>
                <span class="text-muted">Statuts (À faire, Terminée, En cours, Annulée)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-day {
      height: 150px;
      vertical-align: top;
      padding: 5px;
      border: 1px solid #dee2e6;
    }

    .calendar-day.today {
      background-color: rgba(13, 110, 253, 0.1);
    }

    .calendar-day.other-month {
      background-color: #f8f9fa;
      color: #6c757d;
    }

    .calendar-day.has-events {
      background-color: rgba(255, 255, 255, 0.9);
    }

    .calendar-day-header {
      margin-bottom: 5px;
      font-weight: bold;
    }

    .calendar-events {
      max-height: 110px;
      overflow-y: auto;
    }

    .calendar-event {
      padding: 3px 5px;
      margin-bottom: 3px;
      border-radius: 4px;
      color: white;
      font-size: 0.75rem;
      cursor: pointer;
    }

    .calendar-event:hover {
      opacity: 0.9;
    }

    .event-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .event-content strong {
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-content small {
      opacity: 0.9;
    }

    .day-number {
      font-size: 1.1rem;
    }

    table {
      table-layout: fixed;
    }

    th {
      text-align: center;
      font-weight: 600;
    }
  `]
})
export class CalendarViewComponent implements OnInit {
  private taskService = inject(TaskService);

  currentDate = new Date();
  currentMonth: number;
  currentYear: number;
  calendarWeeks: CalendarDay[][] = [];
  events: CalendarEvent[] = [];

  constructor() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit() {
    this.generateCalendar();
    this.loadEvents();
  }

  generateCalendar() {
    this.calendarWeeks = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0
    const totalDays = lastDay.getDate();

    let week: CalendarDay[] = [];
    let dayCounter = 1;

    // Jours du mois précédent
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - firstDayOfWeek + i + 1);
      week.push({
        date: date,
        isCurrentMonth: false,
        events: this.getEventsForDate(date)
      });
    }

    // Jours du mois courant
    while (dayCounter <= totalDays) {
      for (let i = week.length; i < 7; i++) {
        if (dayCounter > totalDays) break;

        const date = new Date(this.currentYear, this.currentMonth, dayCounter);
        week.push({
          date: date,
          isCurrentMonth: true,
          events: this.getEventsForDate(date)
        });
        dayCounter++;
      }

      if (week.length === 7) {
        this.calendarWeeks.push(week);
        week = [];
      }
    }

    // Jours du mois suivant
    if (week.length > 0) {
      let nextDay = 1;
      for (let i = week.length; i < 7; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, nextDay);
        week.push({
          date: date,
          isCurrentMonth: false,
          events: this.getEventsForDate(date)
        });
        nextDay++;
      }
      this.calendarWeeks.push(week);
    }
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.events.filter(event => event.date === dateStr);
  }

  loadEvents() {
    this.taskService.getTasksByMonth(this.currentYear, this.currentMonth + 1).subscribe({
      next: (tasks: Task[]) => {
        // Convertir les tâches en événements de calendrier
        this.events = tasks.map(task => ({
          id: task.id,
          title: task.titre,
          date: task.date,
          heure: task.heure,
          priorite: task.priorite,
          statut: task.statut,
          description: task.description
        }));
        this.generateCalendar();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements:', error);
      }
    });
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.loadEvents();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.loadEvents();
  }

  goToToday() {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendar();
    this.loadEvents();
  }

  onMonthChange(event: any) {
    const value = event.target.value;
    if (value) {
      const [year, month] = value.split('-');
      this.currentYear = parseInt(year);
      this.currentMonth = parseInt(month) - 1;
      this.generateCalendar();
      this.loadEvents();
    }
  }

  padMonth(month: number): string {
    return (month + 1).toString().padStart(2, '0');
  }

  getMonthYear(): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[this.currentMonth]} ${this.currentYear}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  getPriorityColor(priorite: Priorite): string {
    switch (priorite) {
      case Priorite.URGENTE: return '#dc3545';
      case Priorite.HAUTE: return '#fd7e14';
      case Priorite.MOYENNE: return '#ffc107';
      case Priorite.BASSE: return '#28a745';
      default: return '#6c757d';
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

  getStatutLabel(statut: Statut): string {
    switch (statut) {
      case Statut.A_FAIRE: return 'À faire';
      case Statut.EN_COURS: return 'En cours';
      case Statut.TERMINEE: return 'Terminée';
      case Statut.ANNULEE: return 'Annulée';
      default: return statut;
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

  protected readonly Priorite = Priorite;
  protected readonly Statut = Statut;
}
