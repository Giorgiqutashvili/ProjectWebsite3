import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { appConfig } from './app.config';
import { ApiService } from './api.service';
import { finalize } from 'rxjs';

export const loadingScreenInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(ApiService)


  loading.loadingStart()


  return next(req).pipe(
    finalize(() => {
      loading.loadingStop()
    })
  );
};
