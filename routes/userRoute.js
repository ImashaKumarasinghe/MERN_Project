import express from "express";
import { 
    createUser, 
    loginUser, 
    loginWithGoogle, 
    sendOTP 
} from "./controllers/usercontroller.js";   // CORRECTED PATH

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/reset-password", resetPassword);

userRouter.post("/send-otp", sendOTP);


export default userRouter;
