import express from 'express';
import { loginUser, paymentRazorpay, registerUser, userCredits, verifyRazorPay } from "../controllers/userController.js";
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth ,userCredits);
userRouter.post('/pay-razorpay', userAuth ,paymentRazorpay);
userRouter.post('/verify-razorpay',verifyRazorPay);

export default userRouter;

