import { db } from "@/lib/db";

export type ArchiveFile = {
  id: number;
  workspaceId: number;
  uploadedBy: number;
  uploaderName: string;
  name: string;
  category: "documents" | "images" | "videos" | "other";
  mimeType: string;
  size: number;
  createdAt: Date;
};

export type ArchiveFileWithData = ArchiveFile & {
  data: Buffer;
};

export type UploadFileData = {
  workspaceId: number;
  uploadedBy: number;
  name: string;
  category: "documents" | "images" | "videos" | "other";
  mimeType: string;
  size: number;
  data: Buffer;
};

const SELECT_FILE = `
  SELECT
    f.id,
    f.workspaceId,
    f.uploadedBy,
    f.name,
    f.category,
    f.mimeType,
    f.size,
    f.createdAt,
    u.name AS uploaderName
  FROM files f
  JOIN users u ON u.id = f.uploadedBy
`;

export const archiveRepository = {

  async findAll(workspaceId: number, category?: string): Promise<ArchiveFile[]> {
    const query = category && category !== "all"
      ? `${SELECT_FILE} WHERE f.workspaceId = ? AND f.category = ? ORDER BY f.createdAt DESC`
      : `${SELECT_FILE} WHERE f.workspaceId = ? ORDER BY f.createdAt DESC`;

    const params = category && category !== "all"
      ? [workspaceId, category]
      : [workspaceId];

    const [rows]: any = await db.query(query, params);
    return rows;
  },

  async findById(id: number): Promise<ArchiveFile | null> {
    const [rows]: any = await db.query(
      `${SELECT_FILE} WHERE f.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByIdWithData(id: number): Promise<ArchiveFileWithData | null> {
    const [rows]: any = await db.query(
      `SELECT f.*, u.name AS uploaderName
       FROM files f
       JOIN users u ON u.id = f.uploadedBy
       WHERE f.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async upload(data: UploadFileData): Promise<ArchiveFile> {
    const [result]: any = await db.query(
      `INSERT INTO files (workspaceId, uploadedBy, name, category, mimeType, size, data)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.workspaceId, data.uploadedBy, data.name, data.category, data.mimeType, data.size, data.data]
    );
    return this.findById(result.insertId) as Promise<ArchiveFile>;
  },

  async delete(id: number): Promise<boolean> {
    await db.query(`DELETE FROM files WHERE id = ?`, [id]);
    return true;
  },

  async belongsToWorkspace(fileId: number, workspaceId: number): Promise<boolean> {
    const [rows]: any = await db.query(
      `SELECT id FROM files WHERE id = ? AND workspaceId = ? LIMIT 1`,
      [fileId, workspaceId]
    );
    return rows.length > 0;
  },

};