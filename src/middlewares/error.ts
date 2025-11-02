import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(err);
        
        if (err.name == "UnauthorizedError") {
            res.status(401).json({ message: err.message, stack: err.stack });
            return;
        }
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

        if (err instanceof ZodError) {
            res.status(statusCode).json(
                { message: "Zod Error", stack: err }
            );
            return;
        }

        res.status(statusCode).json(
            { message: err.message, stack: err.stack }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(
            { message: "Exception: Internal server error", stack: "" }
        );
    }
};