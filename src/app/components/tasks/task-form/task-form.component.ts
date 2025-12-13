import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task, TaskPriority, TaskStatus, TaskDTO } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="task-form">
      <div class="row mb-4">
        <div class="col">
          <h2 class="mb-0">
            <i class="fa" [class.fa-edit]="isEditMode" [class.fa-plus]="!isEditMode" me-2></i>
            {{ isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche' }}
          </h2>
          <p class="text-muted mb-0">
            {{ isEditMode ? 'Modifiez les détails de votre tâche' : 'Créez une nouvelle tâche' }}
          </p>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-secondary" routerLink="/tasks">
            <i class="fa fa-arrow-left me-1"></i> Retour
          </button>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-body p-4">
              <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">

                <!-- Titre -->
                <div class="mb-3">
                  <label for="titre" class="form-label">
                    <i class="fa fa-header me-1"></i> Titre <span class="text-danger">*</span>
                  </label>
                  <input type="text" id="titre" formControlName="titre"
                         class="form-control"
                         [class.is-invalid]="taskForm.get('titre')?.invalid && taskForm.get('titre')?.touched"
                         placeholder="Titre de la tâche">
                  <div class="invalid-feedback" *ngIf="taskForm.get('titre')?.errors?.['required']">
                    Le titre est obligatoire
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label for="description" class="form-label">
                    <i class="fa fa-align-left me-1"></i> Description
                  </label>
                  <textarea id="description" formControlName="description"
                            class="form-control"
                            rows="3"
                            placeholder="Description détaillée (optionnelle)"></textarea>
                </div>

                <div class="row">
                  <!-- Date -->
                  <div class="col-md-6 mb-3">
                    <label for="date" class="form-label">
                      <i class="fa fa-calendar me-1"></i> Date <span class="text-danger">*</span>
                    </label>
                    <input type="date" id="date" formControlName="date"
                           class="form-control"
                           [class.is-invalid]="taskForm.get('date')?.invalid && taskForm.get('date')?.touched">
                    <div class="invalid-feedback" *ngIf="taskForm.get('date')?.errors?.['required']">
                      La date est obligatoire
                    </div>
                  </div>

                  <!-- Heure -->
                  <div class="col-md-6 mb-3">
                    <label for="heure" class="form-label">
                      <i class="fa fa-clock me-1"></i> Heure
                    </label>
                    <input type="time" id="heure" formControlName="heure"
                           class="form-control">
                  </div>
                </div>

                <div class="row">
                  <!-- Priorité -->
                  <div class="col-md-6 mb-3">
                    <label for="priorite" class="form-label">
                      <i class="fa fa-exclamation-circle me-1"></i> Priorité
                    </label>
                    <select id="priorite" formControlName="priorite" class="form-select">
                      <option *ngFor="let priority of priorityOptions" [value]="priority">
                        {{ getPriorityLabel(priority) }}
                      </option>
                    </select>
                  </div>

                  <!-- Statut -->
                  <div class="col-md-6 mb-3">
                    <label for="statut" class="form-label">
                      <i class="fa fa-check-circle me-1"></i> Statut
                    </label>
                    <select id="statut" formControlName="statut" class="form-select">
                      <option *ngFor="let status of statusOptions" [value]="status">
                        {{ getStatusLabel(status) }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Boutons -->
                <div class="d-flex gap-2 mt-4">
                  <button type="submit" class="btn btn-primary flex-grow-1" [disabled]="loading || taskForm.invalid">
                    <span *ngIf="!loading">
                      <i class="fa" [class.fa-save]="isEditMode" [class.fa-plus]="!isEditMode" me-1></i>
                      {{ isEditMode ? 'Mettre à jour' : 'Créer la tâche' }}
                    </span>
                    <span *ngIf="loading">
                      <i class="fa fa-spinner fa-spin me-1"></i>
                      {{ isEditMode ? 'Mise à jour...' : 'Création...' }}
                    </span>
                  </button>

                  <button type="button" class="btn btn-outline-secondary" routerLink="/tasks" *ngIf="!isEditMode">
                    Annuler
                  </button>

                  <button type="button" class="btn btn-outline-danger"
                          (click)="deleteTask()" *ngIf="isEditMode">
                    <i class="fa fa-trash me-1"></i> Supprimer
                  </button>
                </div>

                <!-- Message d'erreur -->
                <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show mt-3">
                  {{ errorMessage }}
                  <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
                </div>

                <!-- Message de succès -->
                <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show mt-3">
                  {{ successMessage }}
                  <button type="button" class="btn-close" (click)="successMessage = ''"></button>
                </div>
              </form>
            </div>
          </div>

          <!-- Aperçu -->
          <div class="card mt-4" *ngIf="taskForm.valid">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="fa fa-eye me-2"></i>Aperçu
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <h5>{{ taskForm.value.titre }}</h5>
                  <p class="text-muted">{{ taskForm.value.description || 'Aucune description' }}</p>
                  <div class="d-flex gap-3">
                    <span>
                      <i class="fa fa-calendar text-primary me-1"></i>
                      {{ taskForm.value.date | date:'dd/MM/yyyy' }}
                    </span>
                    <span *ngIf="taskForm.value.heure">
                      <i class="fa fa-clock text-primary me-1"></i>
                      {{ taskForm.value.heure }}
                    </span>
                  </div>
                </div>
                <div class="col-md-4 text-end">
                  <span class="badge fs-6"
                        [class.bg-success]="taskForm.value.priorite === 'BASSE'"
                        [class.bg-primary]="taskForm.value.priorite === 'MOYENNE'"
                        [class.bg-warning]="taskForm.value.priorite === 'HAUTE'"
                        [class.bg-danger]="taskForm.value.priorite === 'URGENTE'">
                    {{ getPriorityLabel(taskForm.value.priorite) }}
                  </span>
                  <br>
                  <span class="badge mt-2"
                        [class.bg-secondary]="taskForm.value.statut === 'A_FAIRE'"
                        [class.bg-warning]="taskForm.value.statut === 'EN_COURS'"
                        [class.bg-success]="taskForm.value.statut === 'TERMINEE'"
                        [class.bg-dark]="taskForm.value.statut === 'ANNULEE'">
                    {{ getStatusLabel(taskForm.value.statut) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
    }

    .badge {
      padding: 0.5em 1em;
    }

    .btn:disabled {
      cursor: not-allowed;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  priorityOptions = Object.values(TaskPriority);
  statusOptions = Object.values(TaskStatus);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      heure: [''],
      priorite: [TaskPriority.MOYENNE],
      statut: [TaskStatus.A_FAIRE]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      } else {
        // Date par défaut = aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        this.taskForm.patchValue({ date: today });
      }
    });
  }

  loadTask(id: number) {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        // Convertir la date au format YYYY-MM-DD
        const taskData = {
          ...task,
          date: new Date(task.date).toISOString().split('T')[0]
        };
        this.taskForm.patchValue(taskData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la tâche:', error);
        this.errorMessage = 'Erreur lors du chargement de la tâche';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const taskData: TaskDTO = this.taskForm.value;

      if (this.isEditMode && this.taskId) {
        // Modification
        this.taskService.updateTask(this.taskId, taskData).subscribe({
          next: () => {
            this.successMessage = 'Tâche mise à jour avec succès!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/tasks']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = error.error?.error || 'Erreur lors de la mise à jour';
            this.loading = false;
          }
        });
      } else {
        // Création
        this.taskService.createTask(taskData).subscribe({
          next: () => {
            this.successMessage = 'Tâche créée avec succès!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/tasks']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = error.error?.error || 'Erreur lors de la création';
            this.loading = false;
          }
        });
      }
    }
  }

  deleteTask() {
    if (this.taskId && confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Erreur lors de la suppression';
        }
      });
    }
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
