import express from "express";
import { login, logOut, register } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.route("/signup").post(register)
authRouter.route("/signin").post(login)
authRouter.route("/signout").post(logOut)


export default authRouter