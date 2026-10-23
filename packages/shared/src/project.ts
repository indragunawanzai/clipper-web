import { z } from "zod";
import { exportStatusSchema } from "./export";

export const createProjectSchema = z.object({
  id: z.uuid(),
  sourceFilename: z.string().min(1),
  sourcePath: z.string().min(1),
  createdAt: z.iso.datetime(),
  durationSeconds: z.number().finite().nonnegative(),
  latestExportStatus: exportStatusSchema.optional(),
  latestExportJobId: z.string().min(1).optional(),
});

export type Project = z.infer<typeof createProjectSchema>;
