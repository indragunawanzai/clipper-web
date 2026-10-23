import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { webConfig } from "../../../../../lib/config.js";
import { getExportJobStatus } from "../../../../../lib/exports.js";
import { getProject } from "../../../../../lib/projects.js";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  const jobId = project?.latestExportJobId;

  if (!project || !jobId) {
    return Response.json({ error: "Export is not available." }, { status: 404 });
  }

  const status = await getExportJobStatus(jobId);
  if (status?.status !== "completed") {
    return Response.json({ error: "Export is not ready." }, { status: 409 });
  }

  const exportsDirectory = resolve(webConfig.localDataDirectory, "exports");
  const outputPath = resolve(exportsDirectory, `${jobId}.mp4`);
  if (!outputPath.startsWith(`${exportsDirectory}/`)) {
    return Response.json({ error: "Export is not available." }, { status: 404 });
  }

  try {
    const output = await readFile(outputPath);
    return new Response(output, {
      headers: {
        "Content-Disposition": `attachment; filename="clipper-${project.id}.mp4"`,
        "Content-Type": "video/mp4",
      },
    });
  } catch {
    return Response.json({ error: "Export is not available." }, { status: 404 });
  }
}
