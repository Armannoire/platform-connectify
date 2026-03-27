import db from "@/lib/db";
import type {
  AnnouncementComment,
  AnnouncementReaction,
  ReactionSummary,
  AddReactionData,
  CreateCommentData,
  UpdateCommentData,
} from "@/types/announcement.ts";

// ── Helpers ───────────────────────────────────────────────────

const SELECT_COMMENT = `
  SELECT
    c.id,
    c.announcementId,
    c.authorId,
    c.parentId,
    c.content,
    c.createdAt,
    c.updatedAt,
    u.name   AS authorName,
    u.avatar AS authorAvatar
  FROM announcement_comments c
  JOIN users u ON u.id = c.authorId
`;

// ── Reactions ─────────────────────────────────────────────────

export const announcementInteractionRepository = {

  async getReactions(announcementId: number): Promise<ReactionSummary[]> {
    const [rows]: any = await db.query(
      `SELECT r.emoji, COUNT(*) AS count, GROUP_CONCAT(r.userId) AS userIds
       FROM announcement_reactions r
       WHERE r.announcementId = ?
       GROUP BY r.emoji`,
      [announcementId]
    );

    return rows.map((row: any) => ({
      emoji:   row.emoji,
      count:   Number(row.count),
      userIds: row.userIds ? row.userIds.split(",").map(Number) : [],
    }));
  },

  async addReaction(data: AddReactionData): Promise<boolean> {
    await db.query(
      `INSERT IGNORE INTO announcement_reactions (announcementId, userId, emoji)
       VALUES (?, ?, ?)`,
      [data.announcementId, data.userId, data.emoji]
    );
    return true;
  },

  async removeReaction(
    announcementId: number,
    userId: number,
    emoji: string
  ): Promise<boolean> {
    await db.query(
      `DELETE FROM announcement_reactions
       WHERE announcementId = ? AND userId = ? AND emoji = ?`,
      [announcementId, userId, emoji]
    );
    return true;
  },

  async hasReacted(
    announcementId: number,
    userId: number,
    emoji: string
  ): Promise<boolean> {
    const [rows]: any = await db.query(
      `SELECT id FROM announcement_reactions
       WHERE announcementId = ? AND userId = ? AND emoji = ?
       LIMIT 1`,
      [announcementId, userId, emoji]
    );
    return rows.length > 0;
  },

  // ── Comments ──────────────────────────────────────────────────

  async getComments(announcementId: number): Promise<AnnouncementComment[]> {
    const [rows]: any = await db.query(
      `${SELECT_COMMENT}
       WHERE c.announcementId = ? AND c.parentId IS NULL
       ORDER BY c.createdAt ASC`,
      [announcementId]
    );

    const comments: AnnouncementComment[] = [];

    for (const row of rows) {
      const [replies]: any = await db.query(
        `${SELECT_COMMENT}
         WHERE c.parentId = ?
         ORDER BY c.createdAt ASC`,
        [row.id]
      );
      comments.push({ ...row, replies });
    }

    return comments;
  },

  async findCommentById(id: number): Promise<AnnouncementComment | null> {
    const [rows]: any = await db.query(
      `${SELECT_COMMENT} WHERE c.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  },

  async createComment(data: CreateCommentData): Promise<AnnouncementComment> {
    const [result]: any = await db.query(
      `INSERT INTO announcement_comments (announcementId, authorId, parentId, content)
       VALUES (?, ?, ?, ?)`,
      [data.announcementId, data.authorId, data.parentId ?? null, data.content]
    );
    return this.findCommentById(result.insertId) as Promise<AnnouncementComment>;
  },

  async updateComment(
    id: number,
    data: UpdateCommentData
  ): Promise<AnnouncementComment | null> {
    await db.query(
      `UPDATE announcement_comments SET content = ?, updatedAt = NOW() WHERE id = ?`,
      [data.content, id]
    );
    return this.findCommentById(id);
  },

  async deleteComment(id: number): Promise<boolean> {
    await db.query(`DELETE FROM announcement_comments WHERE id = ?`, [id]);
    return true;
  },
};