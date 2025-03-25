import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookies = inject(CookieService);

  console.log("safjkfas")

  const auth = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${cookies.get('user')} `),
  });

  return next(auth);
};
