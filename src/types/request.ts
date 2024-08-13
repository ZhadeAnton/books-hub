import { Request } from "express";
import { UserRole } from "src/models/roles";

export interface AuthenticatedRequest<T = {}> extends Request<{}, {}, T> {
  user?: {
    userId: number;
    role: UserRole;
  };
}

export interface AddBookRequestBody {
  title: string;
  author: string;
  publicationDate: string;
  genres: string[];
}
