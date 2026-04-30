import { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_TOKEN } from "../config/env.js";
import { AccessTokenPayload, verifyAccessToken } from "../utils/auth.utils.js";

type TokenPayload = AccessTokenPayload;

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing",
            });
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format",
            });
        }

        if (!JWT_ACCESS_TOKEN) {
            throw new Error("JWT_ACCESS_TOKEN is not defined");
        }

        req.user = verifyAccessToken(token);
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
