import { getExportJobStatus } from "../../../../lib/exports.js";

type RouteContext = { params: Promise<{ jobId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { jobId } = await params;
  const status = await getExportJobStatus(jobId);

  if (!status) {
    return Response.json({ error: "Export job not found." }, { status: 404 });
  }

  return Response.json(status);
}
