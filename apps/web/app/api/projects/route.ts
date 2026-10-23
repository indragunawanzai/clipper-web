import { listProjects, saveUpload } from "../../../lib/projects.js";

function publicProject(project: Awaited<ReturnType<typeof saveUpload>>) {
  const { sourcePath: _sourcePath, ...safeProject } = project;
  return safeProject;
}

export async function GET() {
  const projects = await listProjects();
  return Response.json(projects.map(publicProject));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const upload = formData.get("file");

  if (!(upload instanceof File)) {
    return Response.json({ error: "Choose an MP4 or MOV video file." }, { status: 400 });
  }

  try {
    const project = await saveUpload(upload);
    return Response.json(publicProject(project), { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to save video." },
      { status: 400 },
    );
  }
}
