import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task, Priorite, Statut } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="task-form">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header" [ngClass]="isEditMode ? 'bg-warning' : 'bg-primary'">
              <h4 class="mb-0 text-white">
                <i class="fas" [ngClass]="isEditMode ? 'fa-edit' : 'fa-plus'"></i>
                {{ isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche' }}
              </h4>
            </div>
            <div class="card-body">
              <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="titre" class="form-label">Titre *</label>
                    <input
                      type="text"
                      id="titre"
                      class="form-control"
                      formControlName="titre"
                      [class.is-invalid]="taskForm.get('titre')?.invalid && taskForm.get('titre')?.touched">
                    <div class="invalid-feedback" *ngIf="taskForm.get('titre')?.errors?.['required']">
                      Le titre est requis
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="date" class="form-label">Date d'échéance *</label>
                    <input
                      type="date"
                      id="date"
                      class="form-control"
                      formControlName="date"
                      [class.is-invalid]="taskForm.get('date')?.invalid && taskForm.get('date')?.touched">
                    <div class="invalid-feedback" *ngIf="taskForm.get('date')?.errors?.['required']">
                      La date d'échéance est requise
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    id="description"
                    class="form-control"
                    rows="4"
                    formControlName="description"></textarea>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="heure" class="form-label">Heure (optionnel)</label>
                    <input
                      type="time"
                      id="heure"
                      class="form-control"
                      formControlName="heure">
                  </div>

                  <div class="col-md-4 mb-3">
                    <label for="priorite" class="form-label">Priorité *</label>
                    <select
                      id="priorite"
                      class="form-select"
                      formControlName="priorite"
                      [class.is-invalid]="taskForm.get('priorite')?.invalid && taskForm.get('priorite')?.touched">
                      <option value="">Sélectionnez une priorité</option>
                      <option *ngFor="let priorite of priorityOptions" [value]="priorite">
                        {{ getPrioriteLabel(priorite) }}
                      </option>
                    </select>
                    <div class="invalid-feedback" *ngIf="taskForm.get('priorite')?.errors?.['required']">
                      La priorité est requise
                    </div>
                  </div>

                  <div class="col-md-4 mb-3">
                    <label for="statut" class="form-label">Statut *</label>
                    <select
                      id="statut"
                      class="form-select"
                      formControlName="statut"
                      [class.is-invalid]="taskForm.get('statut')?.invalid && taskForm.get('statut')?.touched">
                      <option value="">Sélectionnez un statut</option>
                      <option *ngFor="let statut of statusOptions" [value]="statut">
                        {{ getStatutLabel(statut) }}
                      </option>
                    </select>
                    <div class="invalid-feedback" *ngIf="taskForm.get('statut')?.errors?.['required']">
                      Le statut est requis
                    </div>
                  </div>
                </div>

                <div class="mb-3" *ngIf="errorMessage">
                  <div class="alert alert-danger alert-dismissible fade show">
                    {{ errorMessage }}
                    <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <a routerLink="/tasks" class="btn btn-secondary">
                    <i class="fas fa-arrow-left me-2"></i>Retour
                  </a>
                  <div>
                    <button type="button" class="btn btn-outline-secondary me-2" (click)="resetForm()">
                      <i class="fas fa-redo me-2"></i>Réinitialiser
                    </button>
                    <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid || isLoading">
                      <span *ngIf="!isLoading">
                        <i class="fas" [ngClass]="isEditMode ? 'fa-save' : 'fa-plus'"></i>
                        {{ isEditMode ? 'Mettre à jour' : 'Créer' }}
                      </span>
                      <span *ngIf="isLoading">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        {{ isEditMode ? 'Mise à jour...' : 'Création...' }}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  isLoading = false;
  errorMessage = '';

  priorityOptions = Object.values(Priorite);
  statusOptions = Object.values(Statut);

  constructor() {
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      heure: [''],
      priorite: ['', Validators.required],
      statut: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        const formattedDate = task.date ? new Date(task.date).toISOString().split('T')[0] : '';

        this.taskForm.patchValue({
          titre: task.titre,
          description: task.description,
          date: formattedDate,
          heure: task.heure || '',
          priorite: task.priorite,
          statut: task.statut
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la tâche:', error);
        this.errorMessage = 'Erreur lors du chargement de la tâche';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const taskData: Task = this.taskForm.value;

      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, taskData).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.error || 'Erreur lors de la mise à jour';
          }
        });
      } else {
        this.taskService.createTask(taskData).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.error || 'Erreur lors de la création';
          }
        });
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    } else {
      this.taskForm.reset();
    }
  }

  getPrioriteLabel(priorite: string): string {
    switch (priorite) {
      case Priorite.BASSE: return 'Basse';
      case Priorite.MOYENNE: return 'Moyenne';
      case Priorite.HAUTE: return 'Haute';
      default: return priorite;
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case Statut.A_FAIRE: return 'À faire';
      case Statut.EN_COURS: return 'En cours';
      case Statut.TERMINEE: return 'Terminée';
      default: return statut;
    }
  }
}
