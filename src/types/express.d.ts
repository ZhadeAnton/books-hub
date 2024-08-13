import { UserRole } from "../models/roles";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: UserRole;
      };
    }
  }
}
