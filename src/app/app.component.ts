import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-calendar-alt me-2"></i>Mon Agenda
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" *ngIf="authService.isLoggedIn()">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fas fa-tachometer-alt me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/tasks" routerLinkActive="active">
                <i class="fas fa-tasks me-1"></i>Tâches
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/calendar" routerLinkActive="active">
                <i class="fas fa-calendar me-1"></i>Calendrier
              </a>
            </li>
          </ul>

          <div class="navbar-nav" *ngIf="authService.isLoggedIn()">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>{{ authService.getUserNom() }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
                </a></li>
              </ul>
            </li>
          </div>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      margin-bottom: 20px;
    }
    .nav-link {
      cursor: pointer;
    }
    .dropdown-item {
      cursor: pointer;
    }
  `]
})
export class AppComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout(); // PAS de .subscribe() car c'est void
  }
}
