import { getById } from "@/server/services/workspace.service";

export async function GET(
  req: Request,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await context.params;

  const id = Number(workspaceId);

  const workspace = await getById(id);

  return Response.json({
    success: true,
    workspace,
  });
}
