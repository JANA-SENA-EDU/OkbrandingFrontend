import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (isAuth && !isAdmin) {
    return true;
  }

  if (!isAuth) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  } else {
    // Usuario autenticado pero admin: redirigir al panel de admin
    router.navigate(['/admin']);
  }

  return false;
};

