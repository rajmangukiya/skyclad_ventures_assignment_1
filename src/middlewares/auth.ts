import { Request, Response, NextFunction } from "express";
import { UserRole } from "../database/types";
import jwt from "jsonwebtoken";
import env from "../env";
import * as userQuery from "../database/query/user";

const authCheckMiddleware = (userRole: UserRole) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!req.cookies.token) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const decoded = jwt.verify(req.cookies.token, env.JWT_SECRET) as { userId: string };
            if (!decoded || !decoded.userId || typeof decoded.userId !== "string") {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const user = await userQuery.getUserById(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.auth = { user };

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default authCheckMiddleware;