import express from "express";
import { createUserController, getAllUsersController, loginUserController } from "./controller";
import { validateRequest } from "../../middlewares/validator";
import { CreateUserRequest, LoginUserRequest } from "./types";
import { UserRole } from "../../database/types";
import authCheckMiddleware from "../../middlewares/auth";

const router = express.Router();

router.post("/", authCheckMiddleware(UserRole.admin), validateRequest({ body: CreateUserRequest }), createUserController);
router.get("/", authCheckMiddleware(UserRole.admin), getAllUsersController);

// login user
router.post("/login", validateRequest({ body: LoginUserRequest }), loginUserController);

export default router;      