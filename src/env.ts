import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { ZodError, z } from "zod";
import { DeploymentType } from "./types";

const EnvSchema = z.object({
    NODE_ENV: z.string().default(DeploymentType.development),
    PORT: z.coerce.number(),
    MONGODB_URI: z.string().min(1),
    JWT_SECRET: z.string().min(1),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config());

try {
    EnvSchema.parse(process.env);
} catch (error) {
    if (error instanceof ZodError) {
        let message = "Missing required values in .env:\n";
        error.issues.forEach((issue) => {
            message += (issue.path[0]?.toString() ?? "") + "\n";
        });
        const e = new Error(message);
        e.stack = "";
        throw e;
    } else {
        console.error(error);
    }
}

export default EnvSchema.parse(process.env);
