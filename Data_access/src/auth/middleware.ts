import type { Request, Response, NextFunction } from "express";
import { JWT_COOKIE_NAME, verifyAuthToken, type JWTPayload, type Role } from "./jwt";

export interface RequestWithUser extends Request {
  user?: JWTPayload;
}

export function authRequired(req: RequestWithUser, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[JWT_COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "No autenticado" });
    const payload = verifyAuthToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function rbac(...roles: Role[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  };
}
