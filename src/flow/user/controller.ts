import { Request, Response } from "express";
import * as userQuery from "../../database/query/user";
import { CreateUserRequest, LoginUserRequest } from "./types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setCookie } from "../../utils/helper";
import env from "../../env";
import { LOGIN_TOKEN_EXPIRE_TIME_MS } from "../../constants";

export const createUserController = async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {

    try {
        // is user already exists
        const user = await userQuery.getUserByEmail(req.body.email);
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // create user
        await userQuery.createUser(req.body);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all users for admin
export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await userQuery.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// login user
export const loginUserController = async (req: Request<{}, {}, LoginUserRequest>, res: Response) => {
    try {
        const user = await userQuery.getUserByEmail(req.body.email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // compare password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // generate token
        const token = jwt.sign({ userId: user._id }, env.JWT_SECRET );
        setCookie(res, "token", token, LOGIN_TOKEN_EXPIRE_TIME_MS);

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "Internal server error" });
    }
};