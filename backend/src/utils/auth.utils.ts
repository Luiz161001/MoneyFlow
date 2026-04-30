import { JWT_ACCESS_TOKEN, JWT_EXPIRES_IN, JWT_REFRESH_TOKEN } from "../config/env.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export type AccessTokenPayload = {
    sub: string;
    type: "access";
};

export type RefreshTokenPayload = {
    sub: string;
    type: "refresh";
    jti: string;
};

export function generateAccessToken(userId: string) {
    return jwt.sign(
        {
            sub: userId,
            type: "access",
        },
        JWT_ACCESS_TOKEN!,
        {
            expiresIn: JWT_EXPIRES_IN || "15m",
            // issuer: "money-flow-api",
            // audience: "money-flow-web",
        }
    );
}

export function generateRefreshToken(userId: string) {
    const jti = crypto.randomUUID();

    const token = jwt.sign(
        {
            sub: userId,
            type: "refresh",
            jti,
        },
        JWT_REFRESH_TOKEN!,
        {
            expiresIn: "7d",
            // issuer: "money-flow-api",
            // audience: "money-flow-web",
        }
    );

    return { token, jti };
}

export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_TOKEN!, {
        // issuer: "money-flow-api",
        // audience: "money-flow-web",
    }) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_TOKEN!, {
        // issuer: "money-flow-api",
        // audience: "money-flow-web",
    }) as RefreshTokenPayload;
}
