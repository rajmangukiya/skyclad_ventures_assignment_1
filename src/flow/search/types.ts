import { z } from "zod";

export const SearchRequest = z
  .object({
    q: z.string().optional(),
    scope: z.enum(["folder", "files"]).optional(),
    ids: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .strict()
  .refine(
    (data) => data.q !== undefined || data.ids !== undefined,
    {
      message: "Either search query (q) or filter IDs (ids) must be provided",
    }
  );

export type SearchRequest = z.infer<typeof SearchRequest>;

