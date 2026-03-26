import db from "@/lib/db";

export async function findByOwnerId(ownerId: number) {
  const [rows]: any = await db.query(
    "SELECT * FROM workspaces WHERE ownerId = ? LIMIT 1",
    [ownerId]
  );
  return rows[0] || null;
}

export async function findById(id: number) {
  const [rows]: any = await db.query(
    "SELECT * FROM workspaces WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

export async function findAllByUserId(userId: number) {
  const [rows]: any = await db.query(
    `SELECT w.* FROM workspaces w
     LEFT JOIN workspace_members wm ON wm.workspaceId = w.id
     WHERE w.ownerId = ? OR wm.userId = ?
     GROUP BY w.id
     ORDER BY w.createdAt DESC`,
    [userId, userId]
  );
  return rows;
}

export async function create(data: { name: string; ownerId: number }) {
  const [result]: any = await db.query(
    "INSERT INTO workspaces (name, ownerId) VALUES (?, ?)",
    [data.name, data.ownerId]
  );
  return {
    id: result.insertId,
    ...data,
  };
}

export async function getStats(workspaceId: number) {
  const [[projects]]: any = await db.query(
    "SELECT COUNT(*) as count FROM projects WHERE workspaceId = ?",
    [workspaceId]
  );

  const [[members]]: any = await db.query(
    "SELECT COUNT(*) as count FROM workspace_members WHERE workspaceId = ?",
    [workspaceId]
  );

  const [[announcements]]: any = await db.query(
    "SELECT COUNT(*) as count FROM announcements WHERE workspaceId = ?",
    [workspaceId]
  );

  const [[groups]]: any = await db.query(
    "SELECT COUNT(*) as count FROM `groups` WHERE workspaceId = ?",
    [workspaceId]
  );

  const [[files]]: any = await db.query(
    "SELECT COUNT(*) as count FROM files WHERE workspaceId = ?",
    [workspaceId]
  );

  const [recentAnnouncements]: any = await db.query(
    `SELECT a.title, a.createdAt, u.name AS authorName
     FROM announcements a
     JOIN users u ON u.id = a.authorId
     WHERE a.workspaceId = ?
     ORDER BY a.createdAt DESC
     LIMIT 3`,
    [workspaceId]
  );

  return {
    projects:             projects.count,
    members:              members.count,
    announcements:        announcements.count,
    groups:               groups.count,
    files:                files.count,
    recentAnnouncements,
  };
}