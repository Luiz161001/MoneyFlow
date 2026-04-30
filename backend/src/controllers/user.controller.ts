import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.sub;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {

};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {

};
