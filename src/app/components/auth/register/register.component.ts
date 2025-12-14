import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white text-center py-3">
            <h4 class="mb-0">
              <i class="fa fa-user-plus me-2"></i>Inscription
            </h4>
          </div>

          <div class="card-body p-4">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="nom" class="form-label">
                  <i class="fa fa-user me-1"></i> Nom complet
                </label>
                <input type="text" id="nom" formControlName="nom"
                       class="form-control"
                       [class.is-invalid]="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched"
                       placeholder="Votre nom">
                <div class="invalid-feedback" *ngIf="registerForm.get('nom')?.errors?.['required']">
                  Le nom est obligatoire
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('nom')?.errors?.['minlength']">
                  Minimum 2 caractères
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('nom')?.errors?.['maxlength']">
                  Maximum 50 caractères
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="fa fa-envelope me-1"></i> Email
                </label>
                <input type="email" id="email" formControlName="email"
                       class="form-control"
                       [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                       placeholder="votre@email.com">
                <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['required']">
                  L'email est obligatoire
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['email']">
                  Email invalide
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fa fa-lock me-1"></i> Mot de passe
                </label>
                <input type="password" id="password" formControlName="password"
                       class="form-control"
                       [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                       placeholder="Minimum 6 caractères">
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.errors?.['required']">
                  Le mot de passe est obligatoire
                </div>
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.errors?.['minlength']">
                  Minimum 6 caractères
                </div>
              </div>

              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-primary" [disabled]="loading || registerForm.invalid">
                  <span *ngIf="!loading">
                    <i class="fa fa-user-plus me-1"></i> S'inscrire
                  </span>
                  <span *ngIf="loading">
                    <i class="fa fa-spinner fa-spin me-1"></i> Inscription...
                  </span>
                </button>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show">
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
              </div>

              <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show">
                {{ successMessage }}
                <button type="button" class="btn-close" (click)="successMessage = ''"></button>
              </div>
            </form>

            <div class="text-center mt-3">
              <p class="mb-0">
                Déjà un compte ?
                <a routerLink="/login" class="text-decoration-none">Se connecter</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      background: transparent;
      border-bottom: 1px solid #eaeaea;
      color: #333;
    }

    .btn:disabled {
      cursor: not-allowed;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...';

          // Redirection vers login après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'Erreur lors de l\'inscription';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
