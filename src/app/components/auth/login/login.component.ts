import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white text-center py-3">
            <h4 class="mb-0">
              <i class="fa fa-sign-in me-2"></i>Connexion
            </h4>
          </div>

          <div class="card-body p-4">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">
                  <i class="fa fa-envelope me-1"></i> Email
                </label>
                <input type="email" id="email" formControlName="email"
                       class="form-control"
                       [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                       placeholder="votre@email.com">
                <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required']">
                  L'email est obligatoire
                </div>
                <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email']">
                  Email invalide
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  <i class="fa fa-lock me-1"></i> Mot de passe
                </label>
                <input type="password" id="password" formControlName="password"
                       class="form-control"
                       [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                       placeholder="Votre mot de passe">
                <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required']">
                  Le mot de passe est obligatoire
                </div>
              </div>

              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-primary" [disabled]="loading || loginForm.invalid">
                  <span *ngIf="!loading">
                    <i class="fa fa-sign-in me-1"></i> Se connecter
                  </span>
                  <span *ngIf="loading">
                    <i class="fa fa-spinner fa-spin me-1"></i> Connexion...
                  </span>
                </button>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show">
                {{ errorMessage }}
                <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
              </div>
            </form>

            <div class="text-center mt-3">
              <p class="mb-0">
                Pas encore de compte ?
                <a routerLink="/register" class="text-decoration-none">S'inscrire</a>
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
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
      }
    });
  }

  successMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Le token est déjà sauvegardé dans le AuthService
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'Erreur de connexion';
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
