import express from "express";
import { createUser, loginUser, loginWithGoogle } from "./controllers/usercontroller.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);

export default userRouter;
