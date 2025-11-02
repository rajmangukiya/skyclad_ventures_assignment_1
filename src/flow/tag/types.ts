import { z } from "zod";

export const GetDocumentsByPrimaryTagRequest = z
    .object({
        primaryTag: z.string().trim().min(1).max(255),
    })
    .strict();
export type GetDocumentsByPrimaryTagRequest = z.infer<typeof GetDocumentsByPrimaryTagRequest>;