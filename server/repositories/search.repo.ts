import db from "@/lib/db";

export async function searchAnnouncements(workspaceId: number, q: string) {
  const [rows]: any = await db.query(
    `SELECT
       a.id,
       a.title,
       u.name AS authorName
     FROM announcements a
     JOIN users u ON u.id = a.authorId
     WHERE a.workspaceId = ?
       AND a.title LIKE ?
     ORDER BY a.createdAt DESC
     LIMIT 5`,
    [workspaceId, `%${q}%`]
  );
  return rows;
}

export async function searchMembers(workspaceId: number, q: string) {
  const [rows]: any = await db.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.avatar
     FROM workspace_members wm
     JOIN users u ON u.id = wm.userId
     WHERE wm.workspaceId = ?
       AND (u.name LIKE ? OR u.email LIKE ?)
     ORDER BY u.name ASC
     LIMIT 5`,
    [workspaceId, `%${q}%`, `%${q}%`]
  );
  return rows;
}

export async function searchFiles(workspaceId: number, q: string) {
  const [rows]: any = await db.query(
    `SELECT
       f.id,
       f.name,
       f.mimeType,
       f.category
     FROM files f
     WHERE f.workspaceId = ?
       AND f.name LIKE ?
     ORDER BY f.createdAt DESC
     LIMIT 5`,
    [workspaceId, `%${q}%`]
  );
  return rows;
}

export async function searchGroups(workspaceId: number, q: string) {
  const [rows]: any = await db.query(
    "SELECT g.id, g.name, g.description, COUNT(gm.userId) AS memberCount " +
    "FROM `groups` g " +
    "LEFT JOIN group_members gm ON gm.groupId = g.id " +
    "WHERE g.workspaceId = ? AND g.name LIKE ? " +
    "GROUP BY g.id " +
    "ORDER BY g.name ASC " +
    "LIMIT 5",
    [workspaceId, `%${q}%`]
  );
  return rows;
}