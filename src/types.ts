import { ZodObject } from "zod";
import { IBaseUser } from "./database/models/BaseUser";

enum DeploymentType {
    development = "development",
    production = "production",
    staging = "staging"
}

export interface RequestValidators {
    params?: ZodObject<any>;
    body?: ZodObject<any>;
    query?: ZodObject<any>;
}

// extend request type
declare global {
    namespace Express {
        interface Request {
            auth: {
                user: IBaseUser;
            },
            file?: Express.Multer.File;
        }
    }
}

export { DeploymentType };