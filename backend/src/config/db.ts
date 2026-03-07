import { PrismaClient } from "@prisma/client/extension";
import { error } from "node:console";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB Connected through Prisma");
    } catch (error) {
        console.error(`Database connection error: ${error}`);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };