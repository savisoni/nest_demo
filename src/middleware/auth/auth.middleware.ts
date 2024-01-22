// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import AuthenticatedRequest from '../../users/passport/authenticatedUser'; // Replace with the actual path

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.cookies.jwt) {
      req.isAuthenticated = true;
    
    } else {
      req.isAuthenticated = false;
    }
    next();
  }
}
