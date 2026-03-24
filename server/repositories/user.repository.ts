import { db } from "@/lib/db";

export const userRepository = {

  async findByEmail(email: string) {
    const [rows]: any = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  async findById(id: number) {
    const [rows]: any = await db.query(
      "SELECT id, name, email, avatar FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  async findByIdWithPassword(id: number) {
    const [rows]: any = await db.query(
      "SELECT id, name, email, password, avatar FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  async create({
    name,
    email,
    passwordHash,
  }: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    const now = new Date();
    const [result]: any = await db.query(
      "INSERT INTO users (name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [name, email, passwordHash, now, now]
    );
    return { id: result.insertId, name, email };
  },

  async updateProfile(id: number, data: { name?: string; email?: string }) {
    const fields: string[] = [];
    const values: any[]    = [];

    if (data.name  !== undefined) { fields.push("name = ?");  values.push(data.name);  }
    if (data.email !== undefined) { fields.push("email = ?"); values.push(data.email); }

    if (fields.length === 0) return this.findById(id);

    fields.push("updatedAt = NOW()");
    values.push(id);

    await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  async updatePassword(id: number, passwordHash: string) {
    await db.query(
      "UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?",
      [passwordHash, id]
    );
    return true;
  },

  async updateAvatar(id: number, avatar: string) {
    await db.query(
      "UPDATE users SET avatar = ?, updatedAt = NOW() WHERE id = ?",
      [avatar, id]
    );
    return this.findById(id);
  },

};