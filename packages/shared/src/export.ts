import { z } from "zod";

export const exportStatusSchema = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const exportPresetSchema = z.literal("vertical-9:16");

export const createExportRequestSchema = z
  .object({
    projectId: z.uuid(),
    startSeconds: z.number().finite().min(0),
    endSeconds: z.number().finite().positive(),
    preset: exportPresetSchema,
  })
  .refine((request) => request.endSeconds > request.startSeconds, {
    message: "End time must be after start time.",
    path: ["endSeconds"],
  });

export type ExportStatus = z.infer<typeof exportStatusSchema>;
export type ExportPreset = z.infer<typeof exportPresetSchema>;
export type CreateExportRequest = z.infer<typeof createExportRequestSchema>;

export type ExportJobData = CreateExportRequest & {
  inputPath: string;
  outputPath: string;
};
