import express from "express";
import { createUser, loginUser, loginWithGoogle, sendOTP, resetPassword, getUser } 
from "./controllers/usercontroller.js";
import { auth } from "../middleware/auth.js";
import { getAllUsers } from "./controllers/usercontroller.js";


const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/send-otp", sendOTP);
userRouter.get("/", auth, getUser);
userRouter.get("/all", auth, getAllUsers); // GET /api/users/all




export default userRouter;
