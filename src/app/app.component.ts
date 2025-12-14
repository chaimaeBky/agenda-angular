import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fa fa-calendar me-2"></i>Mon Agenda
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" *ngIf="isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fa fa-dashboard me-1"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/tasks" routerLinkActive="active">
                <i class="fa fa-tasks me-1"></i> Tâches
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/calendar" routerLinkActive="active">
                <i class="fa fa-calendar me-1"></i> Calendrier
              </a>
            </li>
          </ul>

          <div class="navbar-nav" *ngIf="isLoggedIn">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-user me-1"></i> {{ currentUser?.nom }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" (click)="logout()">
                  <i class="fa fa-sign-out me-1"></i> Déconnexion
                </a></li>
              </ul>
            </li>
          </div>

          <div class="navbar-nav" *ngIf="!isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">Connexion</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/register">Inscription</a>
            </li>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-light text-center py-3 mt-5 border-top">
      <div class="container">
        <span class="text-muted">© 2025 Mon Agenda - Gestion de tâches</span>
      </div>
    </footer>
  `,
  styles: [`
    .navbar-nav .nav-link.active {
      font-weight: bold;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .dropdown-item {
      cursor: pointer;
    }

    main {
      min-height: calc(100vh - 150px);
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
