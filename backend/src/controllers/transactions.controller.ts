import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";

class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const userTransactions = await prisma.transactions.findMany({
            where: { userId: userId },
            select: {
                id: true,
                type: true,
                value: true,
                description: true,
                category: true,
                createdAt: true,
            }
        });

        console.log("\n\n-------------------\n",userTransactions);

        if (!userTransactions) {
            return res.status(404).json({
                success: false,
                message: "Transactions not found",
            });
        }

        res.status(200).json({
            success: true,
            data: userTransactions
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
        });
    }
}

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;
        const { type, value, description, category } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const userTransaction = await prisma.transactions.create({
            data: {
                value: value,
                type: type,
                category: category,
                description: description,
                userId: userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: {
                id: userTransaction.id,
                value: userTransaction.value,
                type: userTransaction.type,
                description: userTransaction.description,
                createdAt: userTransaction.createdAt,
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

        return res.status(500).json({ success: false, message: "Failed to create a new transaction!" });
    }
}

export const editTransaction = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;
        const { id } = req.params;
        console.log("\n\n",req.params);
        const { description, value, type, category } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Transaction id is required"
            });
        }

        const editedTransaction = await prisma.transactions.update({
            where: {
                id: id,
                userId: userId
            },
            data: {
                value: value,
                type: type,
                category: category,
                description: description,
            }
        });

        res.status(200).json({
            success: true,
            message: "Transaction edited successfully",
            data: {
                value: editedTransaction.value,
                type: editedTransaction.type,
                description: editedTransaction.description,
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

        return res.status(500).json({ success: false, message: "Failed to edit the transaction!" });
    }
}

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.sub;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Transaction id is required"
            });
        }

        await prisma.transactions.delete({
            where: {
                id: id,
                userId: userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Transaction deleted successfully",
        });
    }
    catch (err) {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message,
            });
        }

        return res.status(500).json({ success: false, message: "Failed to delete this transaction!" });
    }
}