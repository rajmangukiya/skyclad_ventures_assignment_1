import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { RequestValidators } from "../types";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export function validateRequest(reqestSchema: RequestValidators) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (reqestSchema.params) {
                req.params = reqestSchema.params.parse(req.params) as ParamsDictionary;
            }
            if (reqestSchema.body) {
                req.body = reqestSchema.body.parse(req.body);
            }
            if (reqestSchema.query) {
                req.query = reqestSchema.query.parse(req.query) as ParsedQs;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422);
            }
            next(error);
        }
    };
}