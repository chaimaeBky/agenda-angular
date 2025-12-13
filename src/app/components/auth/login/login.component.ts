import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">
              <i class="fas fa-sign-in-alt me-2"></i>Connexion
            </h4>
          </div>
          <div class="card-body">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  formControlName="email"
                  [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required']">
                  L'email est requis
                </div>
                <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email']">
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
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required']">
                  Le mot de passe est requis
                </div>
              </div>

              <div class="mb-3" *ngIf="errorMessage">
                <div class="alert alert-danger alert-dismissible fade show">
                  {{ errorMessage }}
                  <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || isLoading">
                  <span *ngIf="!isLoading">Se connecter</span>
                  <span *ngIf="isLoading">
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Connexion...
                  </span>
                </button>
              </div>
            </form>

            <div class="mt-3 text-center">
              <p class="mb-0">
                Pas encore de compte ?
                <a routerLink="/register" class="text-primary">S'inscrire</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Échec de la connexion. Veuillez réessayer.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
