import mysql from "mysql2/promise";

async function addOriginalPriceColumn() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    console.log("🔄 Adicionando coluna original_price...");
    
    // Verifica se a coluna já existe
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM products LIKE 'original_price'"
    );
    
    if ((columns as any[]).length > 0) {
      console.log("✅ Coluna original_price já existe!");
      return;
    }
    
    // Adiciona a coluna
    await connection.query(
      "ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2) NULL AFTER price"
    );
    
    console.log("✅ Coluna original_price adicionada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao adicionar coluna:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

addOriginalPriceColumn()
  .then(() => {
    console.log("✅ Migração concluída!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Falha na migração:", error);
    process.exit(1);
  });
