import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/roles";
import { AuthenticatedRequest } from "src/types/request";
import { JwtPayload } from "src/types/auth";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response<AuthenticatedRequest, Record<string, any>> | undefined => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};

export const authorize = (requiredRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (userRole === undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if ((userRole & requiredRole) === 0) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};
