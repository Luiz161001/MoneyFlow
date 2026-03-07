import { Router } from "express";

const authRouter = Router();

authRouter.get('/me', (req, res, next) => {
    
});

authRouter.post('/register', (req, res, next) => {

});

authRouter.post('/login', (req, res, next) => {

});

authRouter.post('/logout', (req, res, next) => {

});

authRouter.put('/update/:id', (req, res, next) => {

});

authRouter.delete('/delete/:id', (req, res, next) => {

});

export default authRouter;


/**
 * For the MVP
 * 
 * GET /auth/me
 * POST /auth/register
 * POST /auth/login
 * POST /auth/logout
 * PUT /auth/update/:id
 * DELETE /auth/delete/:id
 * 
 */