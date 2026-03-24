import { db } from "@/lib/db";
import type {
  Channel,
  ChannelMessage,
  DirectMessage,
  DMUser,
  CreateChannelData,
  SendChannelMessageData,
  SendDirectMessageData,
} from "@/types/chat";

// ── Helpers ───────────────────────────────────────────────────

const SELECT_CHANNEL_MESSAGE = `
  SELECT
    m.id,
    m.channelId,
    m.authorId,
    m.content,
    m.createdAt,
    u.name   AS authorName,
    u.avatar AS authorAvatar
  FROM channel_messages m
  JOIN users u ON u.id = m.authorId
`;

const SELECT_DIRECT_MESSAGE = `
  SELECT
    m.id,
    m.senderId,
    m.receiverId,
    m.workspaceId,
    m.content,
    m.createdAt,
    u.name   AS senderName,
    u.avatar AS senderAvatar
  FROM direct_messages m
  JOIN users u ON u.id = m.senderId
`;

// ── Repository ────────────────────────────────────────────────

export const chatRepository = {

  // ── Channels ─────────────────────────────────────────────

  async findAllChannels(workspaceId: number): Promise<Channel[]> {
    const [rows]: any = await db.query(
      `SELECT * FROM channels WHERE workspaceId = ? ORDER BY createdAt ASC`,
      [workspaceId]
    );
    return rows;
  },

  async findChannelById(id: number): Promise<Channel | null> {
    const [rows]: any = await db.query(
      `SELECT * FROM channels WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async createChannel(data: CreateChannelData): Promise<Channel> {
    const [result]: any = await db.query(
      `INSERT INTO channels (workspaceId, name, createdBy) VALUES (?, ?, ?)`,
      [data.workspaceId, data.name, data.createdBy]
    );
    return this.findChannelById(result.insertId) as Promise<Channel>;
  },

  async deleteChannel(id: number): Promise<boolean> {
    await db.query(`DELETE FROM channels WHERE id = ?`, [id]);
    return true;
  },

  async channelBelongsToWorkspace(channelId: number, workspaceId: number): Promise<boolean> {
    const [rows]: any = await db.query(
      `SELECT id FROM channels WHERE id = ? AND workspaceId = ? LIMIT 1`,
      [channelId, workspaceId]
    );
    return rows.length > 0;
  },

  // ── Channel Messages ──────────────────────────────────────

  async findChannelMessages(channelId: number): Promise<ChannelMessage[]> {
    const [rows]: any = await db.query(
      `${SELECT_CHANNEL_MESSAGE}
       WHERE m.channelId = ?
       ORDER BY m.createdAt ASC`,
      [channelId]
    );
    return rows;
  },

  async sendChannelMessage(data: SendChannelMessageData): Promise<ChannelMessage> {
    const [result]: any = await db.query(
      `INSERT INTO channel_messages (channelId, authorId, content) VALUES (?, ?, ?)`,
      [data.channelId, data.authorId, data.content]
    );

    const [rows]: any = await db.query(
      `${SELECT_CHANNEL_MESSAGE} WHERE m.id = ? LIMIT 1`,
      [result.insertId]
    );
    return rows[0];
  },

  async deleteChannelMessage(id: number): Promise<boolean> {
    await db.query(`DELETE FROM channel_messages WHERE id = ?`, [id]);
    return true;
  },

  async findChannelMessageById(id: number): Promise<ChannelMessage | null> {
    const [rows]: any = await db.query(
      `${SELECT_CHANNEL_MESSAGE} WHERE m.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  // ── Direct Messages ───────────────────────────────────────

  async findDirectMessages(
    userId1: number,
    userId2: number,
    workspaceId: number
  ): Promise<DirectMessage[]> {
    const [rows]: any = await db.query(
      `${SELECT_DIRECT_MESSAGE}
       WHERE m.workspaceId = ?
       AND (
         (m.senderId = ? AND m.receiverId = ?) OR
         (m.senderId = ? AND m.receiverId = ?)
       )
       ORDER BY m.createdAt ASC`,
      [workspaceId, userId1, userId2, userId2, userId1]
    );
    return rows;
  },

  async sendDirectMessage(data: SendDirectMessageData): Promise<DirectMessage> {
    const [result]: any = await db.query(
      `INSERT INTO direct_messages (senderId, receiverId, workspaceId, content)
       VALUES (?, ?, ?, ?)`,
      [data.senderId, data.receiverId, data.workspaceId, data.content]
    );

    const [rows]: any = await db.query(
      `${SELECT_DIRECT_MESSAGE} WHERE m.id = ? LIMIT 1`,
      [result.insertId]
    );
    return rows[0];
  },

  async deleteDirectMessage(id: number): Promise<boolean> {
    await db.query(`DELETE FROM direct_messages WHERE id = ?`, [id]);
    return true;
  },

  async findDirectMessageById(id: number): Promise<DirectMessage | null> {
    const [rows]: any = await db.query(
      `${SELECT_DIRECT_MESSAGE} WHERE m.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  // ── DM Users ──────────────────────────────────────────────

  async findWorkspaceMembers(workspaceId: number, excludeUserId: number): Promise<DMUser[]> {
    const [rows]: any = await db.query(
      `SELECT u.id, u.name, u.avatar
       FROM workspace_members wm
       JOIN users u ON u.id = wm.userId
       WHERE wm.workspaceId = ? AND wm.userId != ?`,
      [workspaceId, excludeUserId]
    );
    return rows;
  },

};