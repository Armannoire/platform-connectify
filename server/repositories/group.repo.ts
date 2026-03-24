import db from "@/lib/db";
import type {
  GroupWithMembers,
  GroupMember,
  GroupMessage,
  CreateGroupData,
  UpdateGroupData,
  SendMessageData,
} from "@/types/group";

// ── Helpers ───────────────────────────────────────────────────

const SELECT_GROUP = `
  SELECT
    g.id,
    g.workspaceId,
    g.createdBy,
    g.name,
    g.description,
    g.createdAt,
    g.updatedAt
  FROM \`groups\` g
`;

const SELECT_MESSAGE = `
  SELECT
    m.id,
    m.groupId,
    m.authorId,
    m.content,
    m.createdAt,
    u.name   AS authorName,
    u.avatar AS authorAvatar
  FROM group_messages m
  JOIN users u ON u.id = m.authorId
`;

// ── Repository ────────────────────────────────────────────────

export const groupRepository = {

  async findAll(workspaceId: number): Promise<GroupWithMembers[]> {
    const [rows]: any = await db.query(
      `${SELECT_GROUP} WHERE g.workspaceId = ? ORDER BY g.createdAt ASC`,
      [workspaceId]
    );

    const groups = await Promise.all(
      rows.map(async (group: any) => {
        const members = await this.findMembers(group.id);
        return { ...group, members, memberCount: members.length };
      })
    );

    return groups;
  },

  async findById(id: number): Promise<GroupWithMembers | null> {
    const [rows]: any = await db.query(
      `${SELECT_GROUP} WHERE g.id = ? LIMIT 1`,
      [id]
    );
    if (!rows[0]) return null;

    const members = await this.findMembers(id);
    return { ...rows[0], members, memberCount: members.length };
  },

  async findMembers(groupId: number): Promise<GroupMember[]> {
    const [rows]: any = await db.query(
      `SELECT u.id AS userId, u.name, u.avatar, gm.joinedAt
       FROM group_members gm
       JOIN users u ON u.id = gm.userId
       WHERE gm.groupId = ?`,
      [groupId]
    );
    return rows;
  },

  async create(data: CreateGroupData): Promise<GroupWithMembers> {
    const [result]: any = await db.query(
      `INSERT INTO \`groups\` (workspaceId, createdBy, name, description)
       VALUES (?, ?, ?, ?)`,
      [data.workspaceId, data.createdBy, data.name, data.description ?? null]
    );

    await this.addMember(result.insertId, data.createdBy);
    return this.findById(result.insertId) as Promise<GroupWithMembers>;
  },

  async update(id: number, data: UpdateGroupData): Promise<GroupWithMembers | null> {
    const fields: string[] = [];
    const values: any[]    = [];

    if (data.name        !== undefined) { fields.push("name = ?");        values.push(data.name);        }
    if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updatedAt = NOW()");
    values.push(id);

    await db.query(
      `UPDATE \`groups\` SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    await db.query(`DELETE FROM \`groups\` WHERE id = ?`, [id]);
    return true;
  },

  async addMember(groupId: number, userId: number): Promise<boolean> {
    await db.query(
      `INSERT IGNORE INTO group_members (groupId, userId) VALUES (?, ?)`,
      [groupId, userId]
    );
    return true;
  },

  async removeMember(groupId: number, userId: number): Promise<boolean> {
    await db.query(
      `DELETE FROM group_members WHERE groupId = ? AND userId = ?`,
      [groupId, userId]
    );
    return true;
  },

  async isMember(groupId: number, userId: number): Promise<boolean> {
    const [rows]: any = await db.query(
      `SELECT id FROM group_members WHERE groupId = ? AND userId = ? LIMIT 1`,
      [groupId, userId]
    );
    return rows.length > 0;
  },

  async belongsToWorkspace(groupId: number, workspaceId: number): Promise<boolean> {
    const [rows]: any = await db.query(
      `SELECT id FROM \`groups\` WHERE id = ? AND workspaceId = ? LIMIT 1`,
      [groupId, workspaceId]
    );
    return rows.length > 0;
  },

  // ── Messages ─────────────────────────────────────────────────

  async findMessages(groupId: number): Promise<GroupMessage[]> {
    const [rows]: any = await db.query(
      `${SELECT_MESSAGE}
       WHERE m.groupId = ?
       ORDER BY m.createdAt ASC`,
      [groupId]
    );
    return rows;
  },

  async sendMessage(data: SendMessageData): Promise<GroupMessage> {
    const [result]: any = await db.query(
      `INSERT INTO group_messages (groupId, authorId, content)
       VALUES (?, ?, ?)`,
      [data.groupId, data.authorId, data.content]
    );

    const [rows]: any = await db.query(
      `${SELECT_MESSAGE} WHERE m.id = ? LIMIT 1`,
      [result.insertId]
    );

    return rows[0];
  },

  async deleteMessage(id: number): Promise<boolean> {
    await db.query(`DELETE FROM group_messages WHERE id = ?`, [id]);
    return true;
  },

  async findMessageById(id: number): Promise<GroupMessage | null> {
    const [rows]: any = await db.query(
      `${SELECT_MESSAGE} WHERE m.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

};