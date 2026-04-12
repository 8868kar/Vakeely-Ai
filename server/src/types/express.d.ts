import { IUser, ILawyer } from './index.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | ILawyer;
      userId?: string;
      userRole?: string;
    }
  }
}
