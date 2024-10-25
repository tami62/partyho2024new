import * as z from "zod";

export const MovieSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  clues: z
    .array(z.string())
    .min(1, { message: "Please provide at least one clue!" }),
});
