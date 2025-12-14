import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/dashboard">
          <div class="logo-icon me-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 2V5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.5 9.08997H20.5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.6947 13.7H15.7037" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.6947 16.7H15.7037" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.9955 13.7H12.0045" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.9955 16.7H12.0045" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.29431 13.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.29431 16.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span>Mon Agenda</span>
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" *ngIf="isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="fa fa-chart-line me-1"></i> Tableau de bord
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/tasks" routerLinkActive="active">
                <i class="fa fa-tasks me-1"></i> Tâches
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/calendar" routerLinkActive="active">
                <i class="fa fa-calendar-alt me-1"></i> Calendrier
              </a>
            </li>
          </ul>

          <div class="navbar-nav ms-auto" *ngIf="isLoggedIn">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">
                <div class="user-avatar me-2">
                  <i class="fa fa-user-circle"></i>
                </div>
                <span class="user-name">{{ currentUser?.nom }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" (click)="logout()">
                  <i class="fa fa-sign-out-alt me-2"></i> Déconnexion
                </a></li>
              </ul>
            </div>
          </div>

          <div class="navbar-nav ms-auto" *ngIf="!isLoggedIn">
            <li class="nav-item">
              <a class="nav-link" routerLink="/login">Connexion</a>
            </li>
            <li class="nav-item">
              <a class="btn btn-outline-primary ms-2" routerLink="/register">S'inscrire</a>
            </li>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu Principal -->
    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: white;
    }

    .logo-icon {
      color: #4a6fa5;
    }

    .user-avatar {
      color: #666;
      font-size: 1.2rem;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .nav-link.active {
      background-color: rgba(74, 111, 165, 0.08);
      color: #4a6fa5 !important;
    }

    .dropdown-toggle::after {
      margin-left: 0.5rem;
    }

    main {
      min-height: calc(100vh - 80px);
    }

    .navbar-toggler:focus {
      box-shadow: none;
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
