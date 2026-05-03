import { Router } from "express";
import { authenticateToken } from "../midddlewares/auth.middleware.js";
import { getTransactions, createTransaction, editTransaction, deleteTransaction } from "../controllers/transactions.controller.js";

const transactionsRouter = Router();

transactionsRouter.get("/", authenticateToken, getTransactions);
transactionsRouter.post("/create-transaction", authenticateToken, createTransaction);
transactionsRouter.put("/edit-transaction/:id", authenticateToken, editTransaction);
transactionsRouter.delete("/delete-transaction/:id", authenticateToken, deleteTransaction);

export default transactionsRouter;