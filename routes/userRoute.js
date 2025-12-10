import express from "express";
import { createUser, loginUser, loginWithGoogle, sendOTP, resetPassword, getUser } 
from "./controllers/usercontroller.js";
import { auth } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/send-otp", sendOTP);
userRouter.get("/", auth, getUser);



export default userRouter;
