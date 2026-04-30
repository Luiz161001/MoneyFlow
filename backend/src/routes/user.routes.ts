import { Router } from "express";

import { getUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { authenticateToken } from "../midddlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/me', authenticateToken, getUser);
userRouter.put('/update/:id',authenticateToken, updateUser);
userRouter.delete('/delete/:id', authenticateToken, deleteUser);

export default userRouter;
