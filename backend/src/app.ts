import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT, CLIENT_URL } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import transactionsRouter from "./routes/transactions.routes.js";

const app = express();

connectDB();

app.use(cors({
  origin: CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// middleware for json
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/transactions', transactionsRouter);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Disconnect DB in case something goes wrong

// Handle unhandled promise rejections (e.g. database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection: ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Rejection: ", err);
  await disconnectDB();
  process.exit(1);
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.error("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  })
})
