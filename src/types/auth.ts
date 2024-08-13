import { UserRole } from "src/models/roles";

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
