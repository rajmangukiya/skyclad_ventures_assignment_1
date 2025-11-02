import { z } from "zod";

export const AddDocumentRequest = z
    .object({
        primaryTag: z.string().trim().min(1).max(255),
        secondaryTags: z.array(z.string().trim().min(1).max(255)).default([]),
    })
    .strict();
export type AddDocumentRequest = z.infer<typeof AddDocumentRequest>;