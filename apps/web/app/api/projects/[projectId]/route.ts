import { getProject } from "../../../../lib/projects.js";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }

  const { sourcePath: _sourcePath, ...safeProject } = project;
  return Response.json(safeProject);
}
