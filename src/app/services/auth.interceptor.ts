import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Toutes les requêtes vers l'API backend
  if (req.url.includes('localhost:8080')) {
    // Ajouter les credentials pour les sessions
    const cloned = req.clone({
      withCredentials: true
    });
    return next(cloned);
  }

  return next(req);
};
