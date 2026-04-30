import { Router } from "express";

import { register, login, logout, getToken } from "../controllers/auth.controller.js";
import { authenticateToken } from "../midddlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authenticateToken, logout);
authRouter.post('/token', getToken);

export default authRouter;