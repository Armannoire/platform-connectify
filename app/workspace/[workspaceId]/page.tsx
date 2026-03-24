import { getSessionUserId } from "@/lib/auth/session";
import { userRepository } from "@/server/repositories/user.repository";
import { getStats } from "@/server/repositories/workspace.repo";

export default async function WorkspacePage({ params }: { params: Promise<{ workspaceId: string }>}) {
  
  const { workspaceId } = await params;

  const userId = await getSessionUserId();
  const user   = await userRepository.findById(userId!);
  const stats  = await getStats(Number(workspaceId));

  return (
    <>
      <h1 className="text-3xl font-bold mb-1">
        Welcome back, {user?.name}!
      </h1>

      <p className="text-gray-500 mb-8">
        Here is what's happening in your workspace today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Projects</p>
          <h3 className="text-2xl font-bold mt-2">{stats.projects}</h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Team Members</p>
          <h3 className="text-2xl font-bold mt-2">{stats.members}</h3>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Announcements</p>
          <h3 className="text-2xl font-bold mt-2">{stats.announcements}</h3>
        </div>
      </div>
    </>
  );
}