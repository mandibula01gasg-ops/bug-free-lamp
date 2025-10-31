import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../shared/schema.js";
import { eq } from "drizzle-orm";

async function createAdmin() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  const db = drizzle(pool, { schema, mode: "default" });

  const email = process.argv[2] || "admin@acaiprime.com";
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Administrador";

  try {
    const [existingUser] = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1);

    if (existingUser) {
      console.log("❌ Usuário já existe com este email:", email);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(schema.adminUsers).values({
      email,
      passwordHash,
      name,
      role: "admin",
    });

    console.log("✅ Usuário admin criado com sucesso!");
    console.log("📧 Email:", email);
    console.log("🔑 Senha:", password);
    console.log("\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
    process.exit(1);
  }
}

createAdmin();
