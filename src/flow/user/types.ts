import { z } from "zod";
import { UserRole } from "../../database/types";

export const CreateUserRequest = z
    .object({
        name: z.string().trim().min(1).max(255),
        email: z.string().trim().min(1).max(255),
        password: z.string().trim().min(1).max(255),
        role: z.enum([UserRole.support, UserRole.moderator, UserRole.user]),
    })
    .strict();
export type CreateUserRequest = z.infer<typeof CreateUserRequest>;

export const LoginUserRequest = z
    .object({
        email: z.string().trim().min(1).max(255),
        password: z.string().trim().min(1).max(255),
    })
    .strict();
export type LoginUserRequest = z.infer<typeof LoginUserRequest>;