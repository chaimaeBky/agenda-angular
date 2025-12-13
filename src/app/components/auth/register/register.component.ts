import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">
              <i class="fas fa-user-plus me-2"></i>Inscription
            </h4>
          </div>
          <div class="card-body">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="nom" class="form-label">Nom</label>
                <input
                  type="text"
                  id="nom"
                  class="form-control"
                  formControlName="nom"
                  [class.is-invalid]="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('nom')?.errors?.['required']">
                  Le nom est requis
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('nom')?.errors?.['minlength']">
                  Minimum 2 caractères
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  formControlName="email"
                  [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['required']">
                  L'email est requis
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['email']">
                  Email invalide
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  formControlName="password"
                  [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.errors?.['required']">
                  Le mot de passe est requis
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.errors?.['minlength']">
                  Minimum 6 caractères
                </div>
              </div>

              <div class="mb-3" *ngIf="errorMessage">
                <div class="alert alert-danger alert-dismissible fade show">
                  {{ errorMessage }}
                  <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
                </div>
              </div>

              <div class="mb-3" *ngIf="successMessage">
                <div class="alert alert-success alert-dismissible fade show">
                  {{ successMessage }}
                  <button type="button" class="btn-close" (click)="successMessage = ''"></button>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success" [disabled]="registerForm.invalid || isLoading">
                  <span *ngIf="!isLoading">S'inscrire</span>
                  <span *ngIf="isLoading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Inscription...
                  </span>
                </button>
              </div>
            </form>

            <div class="mt-3 text-center">
              <p class="mb-0">
                Déjà un compte ?
                <a routerLink="/login" class="text-success">Se connecter</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData: RegisterRequest = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Inscription réussie ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || "Échec de l'inscription. Veuillez réessayer.";
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
