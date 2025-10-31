import mysql from "mysql2/promise";

async function checkDatabase() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    const conn = await pool.getConnection();
    
    console.log("✅ Conexão com MySQL estabelecida!\n");
    
    const [tables] = await conn.query("SHOW TABLES");
    console.log("📋 Tabelas no banco de dados:");
    console.log(tables);
    console.log("\n");
    
    for (const row of tables as any[]) {
      const tableName = Object.values(row)[0];
      const [desc] = await conn.query(`DESCRIBE ${tableName}`);
      console.log(`📊 Estrutura da tabela ${tableName}:`);
      console.table(desc);
    }
    
    const [adminUsers] = await conn.query("SELECT id, email, name, role FROM admin_users");
    console.log("\n👤 Usuários admin no banco:");
    console.table(adminUsers);
    
    conn.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

checkDatabase();
