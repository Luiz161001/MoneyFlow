import express from "express";
import authRouter from "./routes/auth.route.js";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();
const PORT = 3000;

config();
connectDB();


app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRouter);

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