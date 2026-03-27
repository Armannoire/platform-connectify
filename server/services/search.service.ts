import {
  searchAnnouncements,
  searchMembers,
  searchFiles,
  searchGroups,
} from "@/server/repositories/search.repo";

export async function globalSearch(workspaceId: number, q: string) {
  const [announcements, members, files, groups] = await Promise.all([
    searchAnnouncements(workspaceId, q),
    searchMembers(workspaceId, q),
    searchFiles(workspaceId, q),
    searchGroups(workspaceId, q),
  ]);

  return {
    announcements: announcements.map((a: any) => ({
      id:       a.id,
      title:    a.title,
      subtitle: `by ${a.authorName}`,
      category: "announcements",
      url:      `/workspace/${workspaceId}/announcement`,
    })),
    members: members.map((m: any) => ({
      id:       m.id,
      title:    m.name,
      subtitle: m.email,
      category: "members",
      url:      `/workspace/${workspaceId}/settings`,
      avatar:   m.avatar ?? null,
    })),
    files: files.map((f: any) => ({
      id:       f.id,
      title:    f.name,
      subtitle: f.category ?? f.mimeType ?? "File",
      category: "files",
      url:      `/workspace/${workspaceId}/archive`,
    })),
    groups: groups.map((g: any) => ({
      id:       g.id,
      title:    g.name,
      subtitle: g.description ?? `${g.memberCount} members`,
      category: "groups",
      url:      `/workspace/${workspaceId}/groups`,
    })),
  };
}