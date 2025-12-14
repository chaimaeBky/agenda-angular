import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Toutes les requêtes vers l'API backend
  if (req.url.includes('localhost:8080')) {
    const token = authService.getToken();

    // Cloner la requête pour ajouter les headers
    let cloned = req.clone();

    if (token) {
      // Ajouter le token JWT
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next(cloned);
  }

  return next(req);
};
