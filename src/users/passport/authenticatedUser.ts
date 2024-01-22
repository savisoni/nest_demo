import { Request } from 'express';
import { User } from '../user/user.interface';

interface AuthenticatedRequest extends Request {
  isAuthenticated: boolean;
  user?: User;
}

export default AuthenticatedRequest;
