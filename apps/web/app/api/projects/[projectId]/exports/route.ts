import { queueExport } from "../../../../../lib/exports";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { projectId } = await params;

  try {
    const body = await request.json();
    const exportJob = await queueExport({ ...body, projectId });
    return Response.json(exportJob, { status: 202 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to queue export." },
      { status: 400 },
    );
  }
}
