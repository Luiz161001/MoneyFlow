import { NODE_ENV } from '../config/env.js';
import {
    generateAccessToken,
    generateRefreshToken,
    hashToken,
    verifyRefreshToken,
} from "../utils/auth.utils.js";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";

import bcrypt from "bcryptjs";

class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_COOKIE_PATH = "/api/v1/auth/token";

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        path: REFRESH_TOKEN_COOKIE_PATH,
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};

const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        path: REFRESH_TOKEN_COOKIE_PATH,
    });
};

const getRefreshTokenFromRequest = (req: Request) => {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    return typeof token === "string" && token.length > 0 ? token : undefined;
};

export const getToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = getRefreshTokenFromRequest(req);

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        const payload = verifyRefreshToken(refreshToken);
        const storedToken = await prisma.refreshToken.findUnique({
            where: { tokenId: payload.jti },
        });

        if (
            !storedToken ||
            storedToken.revoked ||
            storedToken.expiresAt <= new Date() ||
            storedToken.hashedToken !== hashToken(refreshToken)
        ) {
            clearRefreshTokenCookie(res);
            return res.status(401).json({
                success: false,
                message: "Refresh token is invalid or expired",
            });
        }

        await prisma.$transaction([
            prisma.refreshToken.delete({
                where: { tokenId: payload.jti },
            }),
            prisma.refreshToken.deleteMany({
                where: {
                    OR: [
                        { expiresAt: { lte: new Date() } },
                        { revoked: true },
                    ],
                },
            }),
        ]);

        const accessToken = generateAccessToken(payload.sub);
        const nextRefreshToken = generateRefreshToken(payload.sub);

        await prisma.refreshToken.create({
            data: {
                userId: payload.sub,
                tokenId: nextRefreshToken.jti,
                hashedToken: hashToken(nextRefreshToken.token),
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
            },
        });

        setRefreshTokenCookie(res, nextRefreshToken.token);

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                accessToken,
            },
        });
    } catch (error) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
            success: false,
            message: "Unable to refresh token",
        });
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });
        //check in the database if user already exists
        if (existingUser) {
            throw new AppError('User already exists', 409);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // add it to the database
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        });

        const accessToken = generateAccessToken(newUser.id);
        const { token: refreshToken, jti } = generateRefreshToken(newUser.id);

        const hashedRefreshToken = hashToken(refreshToken);

        // add refreshToken to database/cache
        await prisma.refreshToken.create({
            data: {
                userId: newUser.id,
                tokenId: jti,
                hashedToken: hashedRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                revoked: false,
            },
        });

        setRefreshTokenCookie(res, refreshToken);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                accessToken,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                },
            },
        });
    }
    catch (err) {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({ success: false, message: "Failed to create a new user!" });
    }
};



export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed!",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed!",
            });
        }

        const accessToken = generateAccessToken(user.id);
        const { token: refreshToken, jti } = generateRefreshToken(user.id);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenId: jti,
                hashedToken: hashToken(refreshToken),
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
            },
        });

        setRefreshTokenCookie(res, refreshToken);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to log in",
        });
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.sub;
        const refreshToken = getRefreshTokenFromRequest(req);

        if (refreshToken) {
            try {
                const payload = verifyRefreshToken(refreshToken);
                await prisma.refreshToken.updateMany({
                    where: {
                        tokenId: payload.jti,
                        userId: userId,
                    },
                    data: { revoked: true },
                });
            } catch (error) {
                // Ignore invalid refresh token on logout and still clear the cookie.
            }
        } else if (userId) {
            await prisma.refreshToken.updateMany({
                where: {
                    userId,
                    revoked: false,
                },
                data: { revoked: true },
            });
        }

        clearRefreshTokenCookie(res);
        return res.status(204).json({
            success: true,
            message: "Logout completed successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to log out",
        });
    }
};
