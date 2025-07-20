import { HttpInterceptorFn } from '@angular/common/http';
import { LoginService } from '../services/login';
import { Inject } from '@angular/core';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = Inject(LoginService);
  const token = loginService.userToken?.get ? loginService.userToken.get() : null;

  const clonedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
  });

  return next(clonedReq);
};
