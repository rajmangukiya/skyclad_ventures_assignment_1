import { Request, Response, NextFunction } from "express";
import { UserRole } from "../database/types";
import jwt from "jsonwebtoken";
import env from "../env";
import * as userQuery from "../database/query/user";

const authCheckMiddleware = (userRoles: UserRole[]) => {
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

            if (!userRoles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default authCheckMiddleware;