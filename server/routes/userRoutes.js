import express from 'express';
import { login, signUp, updateProfile, userAuth } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login);
userRouter.put('/update-profile', protectRoute,updateProfile)
userRouter.get('/check',protectRoute,userAuth)

export default userRouter;