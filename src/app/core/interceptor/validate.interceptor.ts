import { HttpInterceptorFn } from '@angular/common/http';

export const validateInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
