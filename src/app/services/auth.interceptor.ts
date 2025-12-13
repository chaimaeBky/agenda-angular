import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Désactivé car nous utilisons withCredentials directement dans les services
  return next(req);
};
