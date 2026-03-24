import * as workspaceRepo from "@/server/repositories/workspace.repo";

export async function getOrCreate(ownerId: number) {
  let workspace = await workspaceRepo.findByOwnerId(ownerId);

  if (!workspace) {
    workspace = await workspaceRepo.create({
      name: "My Workspace",
      ownerId,
    });
  }

  return workspace;
}

export async function getById(id: number) {
  return workspaceRepo.findById(id);
}
