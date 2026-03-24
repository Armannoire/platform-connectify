import db from "@/lib/db";
import type {
  AnnouncementWithAuthor,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from "@/types/announcement.ts";

// ── Helpers ───────────────────────────────────────────────────

const SELECT_WITH_AUTHOR = `
  SELECT 
    a.id,
    a.workspaceId,
    a.authorId,
    a.title,
    a.content,
    a.createdAt,
    a.updatedAt,
    u.name   AS authorName,
    u.avatar AS authorAvatar
  FROM announcements a
  JOIN users u ON u.id = a.authorId
`;

// ── Repository ────────────────────────────────────────────────

export const announcementRepository = {

  async findAll(workspaceId: number): Promise<AnnouncementWithAuthor[]> {
    const [rows]: any = await db.query(
      `${SELECT_WITH_AUTHOR}
       WHERE a.workspaceId = ?
       ORDER BY a.createdAt DESC`,
      [workspaceId]
    );
    return rows;
  },

  async findById(id: number): Promise<AnnouncementWithAuthor | null> {
    const [rows]: any = await db.query(
      `${SELECT_WITH_AUTHOR}
       WHERE a.id = ?
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data: CreateAnnouncementData): Promise<AnnouncementWithAuthor> {
    const [result]: any = await db.query(
      `INSERT INTO announcements (workspaceId, authorId, title, content)
       VALUES (?, ?, ?, ?)`,
      [data.workspaceId, data.authorId, data.title, data.content]
    );
    return this.findById(result.insertId) as Promise<AnnouncementWithAuthor>;
  },

  async update(id: number, data: UpdateAnnouncementData): Promise<AnnouncementWithAuthor | null> {
    const fields: string[] = [];
    const values: any[]    = [];

    if (data.title   !== undefined) { fields.push("title = ?");   values.push(data.title);   }
    if (data.content !== undefined) { fields.push("content = ?"); values.push(data.content); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updatedAt = NOW()");
    values.push(id);

    await db.query(
      `UPDATE announcements SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    await db.query(
      `DELETE FROM announcements WHERE id = ?`,
      [id]
    );
    return true;
  },

  async belongsToWorkspace(announcementId: number, workspaceId: number): Promise<boolean> {
    const [rows]: any = await db.query(
      `SELECT id FROM announcements 
       WHERE id = ? AND workspaceId = ? 
       LIMIT 1`,
      [announcementId, workspaceId]
    );
    return rows.length > 0;
  },

};